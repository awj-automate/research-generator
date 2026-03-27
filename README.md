# LeadLens

Sales research on any company in under 2 minutes. Enter a company name and domain, get a structured brief with financials, leadership, hiring signals, competitors, and AI-generated pain points.

## Setup

```bash
npm install
cp .env.example .env
# Fill in your API keys
npm run dev
```

## Required API Keys

| Key | Service | Get it at |
|-----|---------|-----------|
| `FIRECRAWL_API_KEY` | Web crawling | firecrawl.dev |
| `PERPLEXITY_API_KEY` | Research queries | perplexity.ai/settings/api |
| `ANTHROPIC_API_KEY` | Pain points synthesis | console.anthropic.com |

## Research Sections

- Company Description
- Financials
- Pricing Intelligence
- Leadership Team
- Recent News
- Hiring Signals
- Competitors
- Likely Pain Points (AI-synthesized)

All sections are toggleable per research run.

## Pipeline

1. **Site Crawl** - Firecrawl scrapes key pages
2. **Research** - Parallel Perplexity queries for each enabled section
3. **Synthesis** - Claude generates pain points from all findings

Cost per run: ~$0.05 in API fees.

## Deploy

Requires a backend for API key security. Use Railway, Render, or similar.
