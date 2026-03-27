import type { RiskCheckResult } from "./risk-checks";

interface PromptVars {
  name: string;
  domain: string;
  category: string;
  siteContext: string;
  riskContext: string;
  userContext: string;
}

export interface SlideQuery {
  id: string;
  title: string;
  model: "sonar" | "sonar-pro";
  maxTokens: number;
  prompt: string;
}

function riskSummary(risk: RiskCheckResult): string {
  const breachLine =
    risk.breaches.length > 0
      ? `Known breaches: ${risk.breaches.map((b) => `${b.name} (${b.breachDate})`).join(", ")}`
      : "No known breaches on HIBP";
  const hnLine = `Hacker News: ${risk.hnMentions} mentions. Top stories: ${risk.hnTopStories.slice(0, 3).join("; ") || "none"}`;
  return `${breachLine}\n${hnLine}`;
}

export function buildSlideQueries(
  vars: { name: string; domain: string; category: string; userContext: string },
  siteContent: Record<string, string>,
  riskChecks: RiskCheckResult
): SlideQuery[] {
  const site = Object.values(siteContent).join("\n\n").slice(0, 6000);
  const risk = riskSummary(riskChecks);
  const v: PromptVars = { ...vars, siteContext: site, riskContext: risk };

  return [
    {
      id: "s01",
      title: "Company Overview",
      model: "sonar",
      maxTokens: 340,
      prompt: `What does ${v.name} (${v.domain}) do? Founded when, how many employees, HQ location, core products/services, notable clients. Market category: ${v.category}. Be specific with numbers. ${v.userContext}`,
    },
    {
      id: "s02",
      title: "Financial Health",
      model: "sonar-pro",
      maxTokens: 400,
      prompt: `${v.name} (${v.domain}) financial health 2022-2025: revenue estimates, funding rounds with investor names, valuation, profitability signals, any financial red flags. ${v.userContext}`,
    },
    {
      id: "s03",
      title: "Pricing Intelligence",
      model: "sonar",
      maxTokens: 340,
      prompt: `${v.name} pricing: exact tier names and costs, enterprise pricing, hidden fees, recent price changes, complaints about pricing. Category: ${v.category}. ${v.userContext}`,
    },
    {
      id: "s04",
      title: "Client Sentiment",
      model: "sonar",
      maxTokens: 370,
      prompt: `${v.name} client sentiment: G2/Capterra rating, top praise themes, top complaint themes, churn signals, NPS if available. ${v.userContext}`,
    },
    {
      id: "s05",
      title: "Team & Culture",
      model: "sonar",
      maxTokens: 340,
      prompt: `${v.name} team and culture: Glassdoor rating, CEO approval, recent layoffs, hiring trends, culture signals, employee count trend. ${v.userContext}`,
    },
    {
      id: "s06",
      title: "Security & Compliance",
      model: "sonar-pro",
      maxTokens: 340,
      prompt: `${v.name} security posture: SOC2, ISO 27001, GDPR, HIPAA certifications, data handling practices, incident history. ${v.riskContext}. ${v.userContext}`,
    },
    {
      id: "s07",
      title: "Legal & Regulatory",
      model: "sonar-pro",
      maxTokens: 480,
      prompt: `${v.name} legal and regulatory risk 2020-2025: lawsuits, fines, settlements, regulatory actions. Include case names and amounts. ${v.userContext}`,
    },
    {
      id: "s08",
      title: "Delivery Quality",
      model: "sonar",
      maxTokens: 340,
      prompt: `${v.name} delivery quality: uptime/reliability, notable wins and failures, engineering health, open source contributions. ${v.riskContext}. ${v.userContext}`,
    },
    {
      id: "s09",
      title: "Competitive Landscape",
      model: "sonar-pro",
      maxTokens: 440,
      prompt: `${v.name} competitive landscape in ${v.category}: top 3-4 competitors with pricing comparison, key differentiators, best alternative and why. ${v.userContext}`,
    },
    {
      id: "s10",
      title: "Leadership & Momentum",
      model: "sonar",
      maxTokens: 290,
      prompt: `${v.name} leadership: CEO and key execs, leadership changes 2023-2025, momentum signals (awards, partnerships, expansion). ${v.userContext}`,
    },
    {
      id: "neg",
      title: "Negotiation Intel",
      model: "sonar-pro",
      maxTokens: 270,
      prompt: `${v.name} negotiation intelligence: typical discount ranges, contract flexibility, end-of-quarter leverage, known negotiation tactics, best leverage points for a buyer. ${v.userContext}`,
    },
  ];
}

export function buildSynthesisPrompt(
  name: string,
  category: string,
  slideContents: Record<string, string>,
  riskChecks: RiskCheckResult,
  userContext: string
): string {
  const slideSummary = Object.entries(slideContents)
    .map(([id, content]) => `[${id}]\n${content}`)
    .join("\n\n");

  const risk = riskSummary(riskChecks);

  return `You are a senior procurement analyst. Synthesize this vendor due diligence research for ${name} (${category}).

RESEARCH DATA:
${slideSummary}

RISK CHECKS:
${risk}

${userContext ? `ADDITIONAL CONTEXT: ${userContext}` : ""}

Respond in EXACTLY this format:
OVERALL SCORE: X/10
CATEGORY SCORES: Financial X/10 | Quality X/10 | Security X/10 | Legal X/10 | Longevity X/10
GREEN FLAGS: [flag1] | [flag2] | [flag3]
RED FLAGS: [flag1] | [flag2] | [flag3]
NEGOTIATION POINTS: [point1] | [point2] | [point3]
RECOMMENDATION: GO / NO-GO / PROCEED WITH CONDITIONS
RATIONALE: [2 sentences, direct, data-backed]

Be specific. Cite evidence from the research. No fluff.`;
}
