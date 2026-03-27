import type { SynthesisResult } from "../types";

export async function runSynthesis(
  prompt: string,
  apiKey: string
): Promise<{ result: SynthesisResult; cost: number }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20241022",
      max_tokens: 1200,
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

  return { result: parseSynthesis(raw), cost };
}

function parseSynthesis(raw: string): SynthesisResult {
  const line = (prefix: string) => {
    const match = raw.match(new RegExp(`${prefix}:?\\s*(.+)`, "i"));
    return match?.[1]?.trim() || "";
  };

  const splitPipe = (prefix: string) =>
    line(prefix)
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split("|")
      .map((s) => s.replace(/^\[/, "").replace(/\]$/, "").trim())
      .filter(Boolean);

  return {
    overallScore: line("OVERALL SCORE"),
    categoryScores: line("CATEGORY SCORES"),
    greenFlags: splitPipe("GREEN FLAGS"),
    redFlags: splitPipe("RED FLAGS"),
    negotiationPoints: splitPipe("NEGOTIATION POINTS"),
    recommendation: line("RECOMMENDATION"),
    rationale: line("RATIONALE"),
    raw,
  };
}
