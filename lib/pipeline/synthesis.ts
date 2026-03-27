import type { PainPoints } from "../types";

export async function runSynthesis(
  prompt: string,
  apiKey: string
): Promise<{ result: PainPoints; cost: number }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text || "";

  const usage = data.usage || {};
  const cost =
    (usage.input_tokens || 0) * 3e-6 + (usage.output_tokens || 0) * 15e-6;

  const points = raw
    .split(/\n/)
    .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line: string) => line.length > 10);

  return { result: { points, raw }, cost };
}
