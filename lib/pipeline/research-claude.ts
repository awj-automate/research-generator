import type { SectionQuery } from "./prompts";

const CLAUDE_PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3e-6, output: 15e-6 },
};

const WEB_SEARCH_COST_PER_SEARCH = 0.01; // $10 per 1,000 searches

// Maps Perplexity model tiers to Claude equivalents
const MODEL_MAP: Record<string, string> = {
  sonar: "claude-sonnet-4-6",
  "sonar-pro": "claude-sonnet-4-6",
};

export async function runResearchQueriesClaude(
  queries: SectionQuery[],
  apiKey: string,
  onProgress: (id: string, title: string) => void
): Promise<{ results: Record<string, string>; cost: number }> {
  let totalCost = 0;
  const results: Record<string, string> = {};

  const runOne = async (q: SectionQuery): Promise<void> => {
    try {
      const model = MODEL_MAP[q.model] || "claude-sonnet-4-6";

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: 5,
            },
          ],
          messages: [{ role: "user", content: q.prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Claude research error for ${q.id}: ${res.status} ${err}`);
        results[q.id] = "";
        return;
      }

      const data = await res.json();

      // Extract text content from Claude's response (may include server_tool_use and web_search_tool_result blocks)
      const textBlocks = (data.content || []).filter(
        (block: { type: string }) => block.type === "text"
      );
      const content = textBlocks
        .map((block: { text: string }) => block.text)
        .join("\n");
      results[q.id] = content;

      // Token costs
      const usage = data.usage || {};
      const rates = CLAUDE_PRICING[model] || CLAUDE_PRICING["claude-sonnet-4-6"];
      totalCost +=
        (usage.input_tokens || 0) * rates.input +
        (usage.output_tokens || 0) * rates.output;

      // Web search costs
      const searchRequests = usage.server_tool_use?.web_search_requests || 0;
      totalCost += searchRequests * WEB_SEARCH_COST_PER_SEARCH;

      onProgress(q.id, q.title);
    } catch (err) {
      console.error(`Claude research error for ${q.id}:`, err);
      results[q.id] = "";
    }
  };

  // Run queries with concurrency limit of 3 to avoid rate limits
  const BATCH_SIZE = 3;
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(runOne));
  }

  return { results, cost: totalCost };
}
