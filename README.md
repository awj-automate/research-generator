# Research Generator

Automated vendor due diligence. Enter a company name, domain, and market category. Get an 11-slide branded presentation with a GO / NO-GO verdict in under 3 minutes.

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
| `ANTHROPIC_API_KEY` | Synthesis | console.anthropic.com |
| `GAMMA_API_KEY` | Deck generation | gamma.app/api |

## Optional

| Key | Service |
|-----|---------|
| `LOGO_DEV_KEY` | Vendor logos (logo.dev) |

## Pipeline

1. **Site Crawl** - Firecrawl scrapes 8 standard pages
2. **Risk Checks** - HIBP breach scan + HN sentiment (free)
3. **Research** - 11 Perplexity queries in parallel
4. **Synthesis** - Claude scores across 5 risk categories
5. **Deck** - Gamma generates an 11-slide presentation

Cost per run: ~$0.10 in API fees.

## Deploy

Requires a backend for API key security. Use Railway, Render, or similar.
