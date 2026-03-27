import { NextRequest } from "next/server";
import { crawlSite } from "@/lib/pipeline/crawl";
import { runRiskChecks } from "@/lib/pipeline/risk-checks";
import { buildSlideQueries, buildSynthesisPrompt } from "@/lib/pipeline/prompts";
import { runResearchQueries } from "@/lib/pipeline/research";
import { runSynthesis } from "@/lib/pipeline/synthesis";
export const maxDuration = 300; // 5 min for Railway/Vercel Pro

export async function POST(req: NextRequest) {
  const { companyName, domain, category, urls, context } = await req.json();

  if (!companyName || !domain || !category) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fcKey = process.env.FIRECRAWL_API_KEY;
  const pxKey = process.env.PERPLEXITY_API_KEY;
  const anKey = process.env.ANTHROPIC_API_KEY;

  console.log("ENV CHECK:", {
    FIRECRAWL: !!fcKey,
    PERPLEXITY: !!pxKey,
    ANTHROPIC: !!anKey,
  });

  if (!fcKey || !pxKey || !anKey) {
    return new Response(JSON.stringify({ error: "API keys not configured", detail: { fc: !!fcKey, px: !!pxKey, an: !!anKey } }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      const startTime = Date.now();
      let totalCost = 0;

      try {
        // Layer 0: Site Crawl
        send("progress", { layer: 0, label: "Starting site crawl...", status: "start" });
        const extraUrls = (urls || "").split(/[\s,]+/).filter(Boolean);
        const siteContent = await crawlSite(domain, extraUrls, fcKey, (detail) => {
          send("progress", { layer: 0, label: detail, status: "done" });
        });
        const pageCount = Object.keys(siteContent).length;
        totalCost += pageCount * 0.002;
        send("progress", { layer: 0, label: `Crawled ${pageCount} pages`, status: "done" });

        // Layer 1: Risk Checks
        send("progress", { layer: 1, label: "Running risk checks...", status: "start" });
        const riskChecks = await runRiskChecks(domain);
        send("progress", {
          layer: 1,
          label: `HIBP: ${riskChecks.breaches.length} breaches, HN: ${riskChecks.hnMentions} mentions`,
          status: "done",
        });

        // Layer 2: Parallel Research
        send("progress", { layer: 2, label: "Running 11 research queries...", status: "start" });
        const queries = buildSlideQueries(
          { name: companyName, domain, category, userContext: context || "" },
          siteContent,
          riskChecks
        );
        const { results: slideResults, cost: researchCost } = await runResearchQueries(
          queries,
          pxKey,
          (id, title) => {
            send("progress", { layer: 2, label: `${title}`, status: "done", detail: id });
          }
        );
        totalCost += researchCost;
        send("progress", { layer: 2, label: "All research complete", status: "done" });

        // Layer 3: Synthesis
        send("progress", { layer: 3, label: "Synthesizing findings...", status: "start" });
        const synthesisPrompt = buildSynthesisPrompt(
          companyName,
          category,
          slideResults,
          riskChecks,
          context || ""
        );
        const { result: synthesis, cost: synthCost } = await runSynthesis(synthesisPrompt, anKey);
        totalCost += synthCost;
        send("progress", { layer: 3, label: `Verdict: ${synthesis.recommendation}`, status: "done" });

        // Send synthesis early so user sees it while deck renders
        send("synthesis", synthesis);

        // Build slides array
        const slides = queries.map((q) => ({
          id: q.id,
          title: q.title,
          content: slideResults[q.id] || "",
        }));
        send("slides", slides);

        // Final result
        const duration = (Date.now() - startTime) / 1000;
        send("result", {
          cost: Math.round(totalCost * 10000) / 10000,
          duration: Math.round(duration),
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
