export interface SectionQuery {
  id: string;
  title: string;
  model: "sonar" | "sonar-pro";
  maxTokens: number;
  prompt: string;
}

const STYLE_RULES = `Be brief and crisp. Never use em dashes. Never use markdown formatting like bold (**), italic (*), bullet points (-), pipes (|), or tables. Write in plain sentences and short paragraphs only. Do not say "based on the available search results" or similar qualifiers, just state the facts directly. If information is completely unavailable, respond with exactly: "Unavailable for this search". If only partial information is found, start with "Partially available info found." then write what was found.`;

export function buildSectionQueries(
  vars: { name: string; domain: string; userContext: string },
  siteContent: Record<string, string>,
  enabledSections: string[]
): SectionQuery[] {
  const site = Object.values(siteContent).join("\n\n").slice(0, 6000);

  const allQueries: SectionQuery[] = [
    {
      id: "description",
      title: "Company Description",
      model: "sonar",
      maxTokens: 200,
      prompt: `What does ${vars.name} (${vars.domain}) do? Explain in 1-2 concise sentences. Include what they sell or offer and who their target customer is. ${STYLE_RULES} ${vars.userContext}`,
    },
    {
      id: "financials",
      title: "Financials",
      model: "sonar-pro",
      maxTokens: 400,
      prompt: `${vars.name} (${vars.domain}) financial overview 2022-2025: revenue estimates, funding rounds with investor names, valuation, profitability signals, any financial red flags. Write this as a few short paragraphs, not a list. ${STYLE_RULES} ${vars.userContext}`,
    },
    {
      id: "pricing",
      title: "Pricing Intelligence",
      model: "sonar",
      maxTokens: 340,
      prompt: `${vars.name} (${vars.domain}) pricing: exact tier names and costs, enterprise pricing, hidden fees, recent price changes, complaints about pricing. Write as short paragraphs. ${STYLE_RULES} ${vars.userContext}`,
    },
    {
      id: "leadership",
      title: "Leadership Team",
      model: "sonar-pro",
      maxTokens: 400,
      prompt: `List the key leaders at ${vars.name} (${vars.domain}): Founder(s), CEO, board members, and other C-suite executives. For each person, write their name, title, and one short sentence about their background. Write each person on their own line, like "Name, Title. Background sentence." Do not use bullet points, dashes, or any markdown formatting. ${STYLE_RULES} ${vars.userContext}`,
    },
    {
      id: "news",
      title: "Recent News",
      model: "sonar",
      maxTokens: 350,
      prompt: `What is the most relevant recent news about ${vars.name} (${vars.domain}) from the past 6 months? Include product launches, partnerships, funding, acquisitions, layoffs, or any notable events. Write 3-5 items, each as a short sentence on its own line. Do not use bullet points, dashes, or any markdown formatting. ${STYLE_RULES} ${vars.userContext}`,
    },
    {
      id: "hiring",
      title: "Hiring",
      model: "sonar",
      maxTokens: 350,
      prompt: `Is ${vars.name} (${vars.domain}) currently hiring? Check their careers page and job boards. If they have open roles, identify the top 3 departments they are hiring for (e.g. Marketing, Sales, Product, Engineering). For each department, mention 1-2 example job titles. Write as short paragraphs, not lists. If no jobs are found, say so. Site context: ${site.slice(0, 1500)} ${STYLE_RULES} ${vars.userContext}`,
    },
    {
      id: "competitors",
      title: "Competitors",
      model: "sonar",
      maxTokens: 150,
      prompt: `What are the top 3 competitors to ${vars.name} (${vars.domain})? Return ONLY the company names separated by commas, nothing else. Example: "Acme, Globex, Initech"`,
    },
  ];

  return allQueries.filter((q) => enabledSections.includes(q.id));
}

export function buildPainPointsPrompt(
  name: string,
  sectionContents: Record<string, string>,
  userContext: string
): string {
  const summary = Object.entries(sectionContents)
    .map(([id, content]) => `[${id}]\n${content}`)
    .join("\n\n");

  return `You are a sales research analyst helping a salesperson prepare for prospecting outreach to ${name}.

RESEARCH DATA:
${summary}

${userContext ? `ADDITIONAL CONTEXT: ${userContext}` : ""}

Based on all of the research above, identify 3-5 likely pain points that this company might have. These should be specific, actionable pain points that a salesperson could lean into during outreach. Think about what challenges they face given their stage, hiring patterns, competitive landscape, pricing, and recent news.

Format your response as a numbered list. Each pain point should be 1-2 sentences. Be direct and specific. Never use em dashes. Do not say "based on the available search results" or similar qualifiers. Do not use any markdown formatting like bold (**) or italic (*).`;
}
