export interface BreachInfo {
  name: string;
  breachDate: string;
  pwnCount: number;
}

export interface RiskCheckResult {
  breaches: BreachInfo[];
  hnMentions: number;
  hnTopStories: string[];
}

export async function runRiskChecks(domain: string): Promise<RiskCheckResult> {
  const [breachResult, hnResult] = await Promise.all([
    checkHIBP(domain),
    checkHN(domain),
  ]);

  return {
    breaches: breachResult,
    hnMentions: hnResult.mentions,
    hnTopStories: hnResult.stories,
  };
}

async function checkHIBP(domain: string): Promise<BreachInfo[]> {
  try {
    const res = await fetch(
      `https://haveibeenpwned.com/api/v3/breaches?domain=${domain}`,
      { headers: { "User-Agent": "ResearchGenerator" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).map((b: Record<string, unknown>) => ({
      name: b.Name as string,
      breachDate: b.BreachDate as string,
      pwnCount: b.PwnCount as number,
    }));
  } catch {
    return [];
  }
}

async function checkHN(query: string): Promise<{ mentions: number; stories: string[] }> {
  try {
    const res = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`
    );
    if (!res.ok) return { mentions: 0, stories: [] };
    const data = await res.json();
    return {
      mentions: data.nbHits || 0,
      stories: (data.hits || []).map((h: Record<string, unknown>) => h.title as string),
    };
  } catch {
    return { mentions: 0, stories: [] };
  }
}
