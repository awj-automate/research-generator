import type { SlideQuery } from "./prompts";

const PRICING: Record<string, { input: number; output: number }> = {
  sonar: { input: 1e-6, output: 1e-6 },
  "sonar-pro": { input: 3e-6, output: 15e-6 },
};

export async function runResearchQueries(
  queries: SlideQuery[],
  apiKey: string,
  onProgress: (id: string, title: string) => void
): Promise<{ results: Record<string, string>; cost: number }> {
  let totalCost = 0;
  const results: Record<string, string> = {};

  const runOne = async (q: SlideQuery): Promise<void> => {
    try {
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: q.model,
          messages: [{ role: "user", content: q.prompt }],
          max_tokens: q.maxTokens,
        }),
      });

      if (!res.ok) {
        results[q.id] = "";
        return;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      results[q.id] = content;

      const usage = data.usage || {};
      const rates = PRICING[q.model] || PRICING.sonar;
      totalCost +=
        (usage.prompt_tokens || 0) * rates.input +
        (usage.completion_tokens || 0) * rates.output;

      onProgress(q.id, q.title);
    } catch {
      results[q.id] = "";
    }
  };

  // Run all 11 queries in parallel
  await Promise.all(queries.map(runOne));

  return { results, cost: totalCost };
}
