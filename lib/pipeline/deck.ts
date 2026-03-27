import type { SlideContent } from "../types";

const GAMMA_BASE = "https://public-api.gamma.app/v1.0";

export async function generateDeck(
  slides: SlideContent[],
  synthesisRaw: string,
  logoUrl: string,
  apiKey: string,
  onProgress: (msg: string) => void
): Promise<{ url: string | null; id: string | null }> {
  const inputText = slides
    .map((s) => `# ${s.title}\n\n${s.content}`)
    .join("\n\n---\n\n");

  const fullText = `${inputText}\n\n---\n\n# Verdict\n\n${synthesisRaw}`;

  onProgress("Submitting to Gamma...");

  const res = await fetch(`${GAMMA_BASE}/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputText: fullText,
      textMode: "preserve",
      format: "presentation",
      cardSplit: "inputTextBreaks",
      imageOptions: { source: "pictographic" },
      cardOptions: {
        dimensions: "16x9",
        headerFooter: {
          bottomRight: { type: "cardNumber" },
          bottomLeft: { type: "image", source: "custom", src: logoUrl },
        },
      },
      sharingOptions: { externalAccess: "view" },
      themeId: "chisel",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    onProgress(`Gamma error: ${err}`);
    return { url: null, id: null };
  }

  const gen = await res.json();
  const genId = gen.id;

  if (!genId) {
    return { url: null, id: null };
  }

  onProgress("Rendering deck...");

  // Poll for completion (max 6 minutes)
  for (let i = 0; i < 72; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const pollRes = await fetch(`${GAMMA_BASE}/generations/${genId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!pollRes.ok) continue;

    const status = await pollRes.json();
    if (status.status === "complete" || status.gammaUrl || status.url) {
      const deckUrl = status.gammaUrl || status.url;
      onProgress("Deck ready");
      return { url: deckUrl, id: genId };
    }

    if (status.status === "error") {
      onProgress("Deck generation failed");
      return { url: null, id: genId };
    }

    if (i % 6 === 0) onProgress(`Still rendering... (${Math.round((i * 5) / 60)}m)`);
  }

  onProgress("Deck generation timed out");
  return { url: null, id: genId };
}
