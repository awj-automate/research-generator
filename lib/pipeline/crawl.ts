const STANDARD_PATHS = [
  "", "/pricing", "/about", "/security", "/terms", "/privacy", "/contact", "/blog",
];

export async function crawlSite(
  domain: string,
  extraUrls: string[],
  apiKey: string,
  onProgress: (label: string) => void
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  const urls = STANDARD_PATHS.map((p) => `https://${domain}${p}`);
  for (const u of extraUrls) {
    if (u && !urls.includes(u)) urls.push(u.startsWith("http") ? u : `https://${u}`);
  }

  const crawlOne = async (url: string): Promise<[string, string]> => {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ url, formats: ["markdown"] }),
      });
      if (!res.ok) return [url, ""];
      const data = await res.json();
      const md = (data?.data?.markdown || "").slice(0, 4000);
      return [url, md];
    } catch {
      return [url, ""];
    }
  };

  const batches = [];
  for (let i = 0; i < urls.length; i += 4) {
    batches.push(urls.slice(i, i + 4));
  }

  for (const batch of batches) {
    const promises = batch.map((u) => crawlOne(u));
    const batchResults = await Promise.all(promises);
    for (const [url, content] of batchResults) {
      if (content) {
        results[url] = content;
        onProgress(`Crawled ${url.replace(`https://${domain}`, "") || "/"}`);
      }
    }
  }

  return results;
}

export function getLogoUrl(domain: string, logoKey?: string): string {
  if (logoKey) {
    return `https://img.logo.dev/${domain}?token=${logoKey}&size=80&format=png`;
  }
  return `https://logo.clearbit.com/${domain}`;
}
