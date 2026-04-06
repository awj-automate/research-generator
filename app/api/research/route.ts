import { NextRequest } from "next/server";
import { crawlSite } from "@/lib/pipeline/crawl";
import { buildSectionQueries, buildPainPointsPrompt } from "@/lib/pipeline/prompts";
import { runResearchQueries } from "@/lib/pipeline/research";
import { runResearchQueriesClaude } from "@/lib/pipeline/research-claude";
import { runSynthesis } from "@/lib/pipeline/synthesis";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { companyName, domain, urls, context, sections } = await req.json();

  if (!companyName || !domain) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fcKey = process.env.FIRECRAWL_API_KEY;
  const pxKey = process.env.PERPLEXITY_API_KEY;
  const anKey = process.env.ANTHROPIC_API_KEY;

  if (!fcKey || !pxKey || !anKey) {
    return new Response(
      JSON.stringify({ error: "API keys not configured", detail: { fc: !!fcKey, px: !!pxKey, an: !!anKey } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const enabledSections: string[] = sections || [
    "description", "financials", "pricing", "leadership", "news", "hiring", "competitors",
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      const startTime = Date.now();

      try {
        // ── Layer 0: Shared Site Crawl ──────────────────────────────
        send("progress", { pipeline: "shared", layer: 0, label: "Crawling site...", status: "start" });
        const extraUrls = (urls || "").split(/[\s,]+/).filter(Boolean);
        const siteContent = await crawlSite(domain, extraUrls, fcKey, (detail) => {
          send("progress", { pipeline: "shared", layer: 0, label: detail, status: "done" });
        });
        const pageCount = Object.keys(siteContent).length;
        const firecrawlCost = pageCount * 0.002;
        send("progress", { pipeline: "shared", layer: 0, label: `Crawled ${pageCount} pages`, status: "done" });

        const researchSections = enabledSections.filter((s) => s !== "painpoints");
        const queries = buildSectionQueries(
          { name: companyName, domain, userContext: context || "" },
          siteContent,
          researchSections
        );

        // ── Layer 1: Research (both pipelines in parallel) ──────────
        send("progress", { pipeline: "perplexity", layer: 1, label: `Running ${researchSections.length} research queries...`, status: "start" });
        send("progress", { pipeline: "claude", layer: 1, label: `Running ${researchSections.length} research queries...`, status: "start" });

        const [pxResearch, clResearch] = await Promise.all([
          runResearchQueries(queries, pxKey, (id, title) => {
            send("progress", { pipeline: "perplexity", layer: 1, label: title, status: "done", detail: id });
          }),
          runResearchQueriesClaude(queries, anKey, (id, title) => {
            send("progress", { pipeline: "claude", layer: 1, label: title, status: "done", detail: id });
          }),
        ]);

        send("progress", { pipeline: "perplexity", layer: 1, label: "Research complete", status: "done" });
        send("progress", { pipeline: "claude", layer: 1, label: "Research complete", status: "done" });

        // Send sections for both
        const pxSectionData = queries.map((q) => ({
          id: q.id, title: q.title, content: pxResearch.results[q.id] || "",
        }));
        const clSectionData = queries.map((q) => ({
          id: q.id, title: q.title, content: clResearch.results[q.id] || "",
        }));
        send("sections", { pipeline: "perplexity", sections: pxSectionData });
        send("sections", { pipeline: "claude", sections: clSectionData });

        // ── Layer 2: Pain Points Synthesis (both in parallel) ───────
        let pxPainPoints = null;
        let clPainPoints = null;
        let pxSynthCost = 0;
        let clSynthCost = 0;

        if (enabledSections.includes("painpoints")) {
          send("progress", { pipeline: "perplexity", layer: 2, label: "Synthesizing pain points...", status: "start" });
          send("progress", { pipeline: "claude", layer: 2, label: "Synthesizing pain points...", status: "start" });

          const pxPrompt = buildPainPointsPrompt(companyName, pxResearch.results, context || "");
          const clPrompt = buildPainPointsPrompt(companyName, clResearch.results, context || "");

          const [pxSynth, clSynth] = await Promise.all([
            Object.keys(pxResearch.results).length > 0
              ? runSynthesis(pxPrompt, anKey)
              : Promise.resolve({ result: { points: [] as string[], raw: "" }, cost: 0 }),
            Object.keys(clResearch.results).length > 0
              ? runSynthesis(clPrompt, anKey)
              : Promise.resolve({ result: { points: [] as string[], raw: "" }, cost: 0 }),
          ]);

          pxPainPoints = pxSynth.result;
          clPainPoints = clSynth.result;
          pxSynthCost = pxSynth.cost;
          clSynthCost = clSynth.cost;

          send("progress", { pipeline: "perplexity", layer: 2, label: `Found ${pxPainPoints.points.length} pain points`, status: "done" });
          send("progress", { pipeline: "claude", layer: 2, label: `Found ${clPainPoints.points.length} pain points`, status: "done" });
          send("painpoints", { pipeline: "perplexity", painpoints: pxPainPoints });
          send("painpoints", { pipeline: "claude", painpoints: clPainPoints });
        }

        // ── Final result with cost breakdown ────────────────────────
        const duration = (Date.now() - startTime) / 1000;

        send("result", {
          duration: Math.round(duration),
          perplexity: {
            firecrawlCost,
            researchCost: pxResearch.cost,
            synthesisCost: pxSynthCost,
            totalCost: Math.round((firecrawlCost + pxResearch.cost + pxSynthCost) * 10000) / 10000,
          },
          claude: {
            firecrawlCost,
            researchCost: clResearch.cost,
            synthesisCost: clSynthCost,
            totalCost: Math.round((firecrawlCost + clResearch.cost + clSynthCost) * 10000) / 10000,
            totalWithoutFirecrawl: Math.round((clResearch.cost + clSynthCost) * 10000) / 10000,
          },
        });
      } catch (err) {
        send("error", { message: err instanceof Error ? err.message : "Pipeline failed" });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
