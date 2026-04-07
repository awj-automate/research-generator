import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { researchReports, usageLog } from "@/lib/db/schema";
import { crawlSite } from "@/lib/pipeline/crawl";
import { buildSectionQueries, buildPainPointsPrompt } from "@/lib/pipeline/prompts";
import { runResearchQueries } from "@/lib/pipeline/research";
import { runSynthesis } from "@/lib/pipeline/synthesis";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = session.user.id;
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
      let totalCost = 0;

      try {
        // Layer 0: Site Crawl
        send("progress", { layer: 0, label: "Crawling site...", status: "start" });
        const extraUrls = (urls || "").split(/[\s,]+/).filter(Boolean);
        const siteContent = await crawlSite(domain, extraUrls, fcKey, (detail) => {
          send("progress", { layer: 0, label: detail, status: "done" });
        });
        const pageCount = Object.keys(siteContent).length;
        totalCost += pageCount * 0.002;
        send("progress", { layer: 0, label: `Crawled ${pageCount} pages`, status: "done" });

        // Layer 1: Research Queries
        const researchSections = enabledSections.filter((s) => s !== "painpoints");
        send("progress", { layer: 1, label: `Running ${researchSections.length} research queries...`, status: "start" });
        const queries = buildSectionQueries(
          { name: companyName, domain, userContext: context || "" },
          siteContent,
          researchSections
        );
        const { results: sectionResults, cost: researchCost } = await runResearchQueries(
          queries,
          pxKey,
          (id, title) => {
            send("progress", { layer: 1, label: title, status: "done", detail: id });
          }
        );
        totalCost += researchCost;
        send("progress", { layer: 1, label: "Research complete", status: "done" });

        // Build sections array
        const sectionData = queries.map((q) => ({
          id: q.id,
          title: q.title,
          content: sectionResults[q.id] || "",
        }));
        send("sections", sectionData);

        // Layer 2: Pain Points Synthesis (if enabled)
        let painPoints = null;
        if (enabledSections.includes("painpoints") && Object.values(sectionResults).some((v) => v.trim().length > 0)) {
          send("progress", { layer: 2, label: "Synthesizing pain points...", status: "start" });
          const prompt = buildPainPointsPrompt(companyName, sectionResults, context || "");
          const { result, cost: synthCost } = await runSynthesis(prompt, anKey);
          painPoints = result;
          totalCost += synthCost;
          send("progress", { layer: 2, label: `Found ${result.points.length} pain points`, status: "done" });
          send("painpoints", painPoints);
        }

        // Final result
        const duration = (Date.now() - startTime) / 1000;
        const finalCost = Math.round(totalCost * 10000) / 10000;
        const finalDuration = Math.round(duration);

        send("result", { cost: finalCost, duration: finalDuration });

        // Save report to database
        try {
          await getDb().insert(researchReports).values({
            userId,
            companyName,
            domain,
            context: context || null,
            sections: sectionData,
            painPoints,
            cost: String(finalCost),
            duration: finalDuration,
          });

          await getDb().insert(usageLog).values({
            userId,
            action: "research_run",
            metadata: { companyName, domain, cost: finalCost, duration: finalDuration },
          });
        } catch (dbErr) {
          console.error("Failed to save report to DB:", dbErr);
        }
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
