import type { SectionQuery } from "./prompts";

const PRICING: Record<string, { input: number; output: number }> = {
  sonar: { input: 1e-6, output: 1e-6 },
  "sonar-pro": { input: 3e-6, output: 15e-6 },
};

async function perplexityCall(
  model: string,
  prompt: string,
  maxTokens: number,
  apiKey: string
): Promise<{ content: string; cost: number }> {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) return { content: "", cost: 0 };

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  const usage = data.usage || {};
  const rates = PRICING[model as keyof typeof PRICING] || PRICING.sonar;
  const cost =
    (usage.prompt_tokens || 0) * rates.input +
    (usage.completion_tokens || 0) * rates.output;

  return { content, cost };
}

async function expandCompetitors(
  companyName: string,
  competitorList: string,
  apiKey: string
): Promise<{ content: string; cost: number }> {
  // Parse competitor names from the comma-separated response
  const names = competitorList
    .split(/,/)
    .map((n) => n.trim().replace(/^\d+\.\s*/, ""))
    .filter((n) => n.length > 1 && n.length < 80)
    .slice(0, 3);

  if (names.length === 0) return { content: competitorList, cost: 0 };

  let totalCost = 0;
  const lines: string[] = [];

  // Run a quick search on each competitor in parallel
  const lookups = names.map(async (name) => {
    const { content, cost } = await perplexityCall(
      "sonar",
      `In 1 sentence, what does ${name} do and how is it different from ${companyName}? Be specific and direct. Do not use any markdown formatting.`,
      100,
      apiKey
    );
    totalCost += cost;
    return { name, description: content.trim() };
  });

  const results = await Promise.all(lookups);
  for (const r of results) {
    if (r.description) {
      lines.push(`${r.name}\n${r.description}`);
    } else {
      lines.push(r.name);
    }
  }

  return { content: lines.join("\n\n"), cost: totalCost };
}

export async function runResearchQueries(
  queries: SectionQuery[],
  apiKey: string,
  onProgress: (id: string, title: string) => void
): Promise<{ results: Record<string, string>; cost: number }> {
  let totalCost = 0;
  const results: Record<string, string> = {};

  const runOne = async (q: SectionQuery): Promise<void> => {
    try {
      const { content, cost } = await perplexityCall(q.model, q.prompt, q.maxTokens, apiKey);
      totalCost += cost;

      if (q.id === "competitors" && content) {
        // Follow up with individual lookups for each competitor
        const expanded = await expandCompetitors(
          // Extract company name from the prompt (it's the first thing before the parenthesized domain)
          q.prompt.match(/competitors to (.+?) \(/)?.[1] || "the company",
          content,
          apiKey
        );
        results[q.id] = expanded.content;
        totalCost += expanded.cost;
      } else {
        results[q.id] = content;
      }

      onProgress(q.id, q.title);
    } catch {
      results[q.id] = "";
    }
  };

  await Promise.all(queries.map(runOne));

  return { results, cost: totalCost };
}
