import Link from "next/link";

const STEPS = [
  { num: "01", title: "Input", desc: "Company name, domain, market category." },
  { num: "02", title: "Crawl + Research", desc: "Site crawl, breach scan, 11 parallel research queries." },
  { num: "03", title: "Synthesis", desc: "Claude scores and flags the vendor. GO, NO-GO, or conditional." },
  { num: "04", title: "Deck", desc: "11-slide presentation in the vendor's brand colors." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display text-xl tracking-tight text-ink-900">Research Generator</span>
        <Link
          href="/app"
          className="px-5 py-2 rounded-lg bg-burnt-500 text-white text-sm font-medium hover:bg-burnt-600 transition-colors"
        >
          Launch
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="font-display text-5xl leading-tight tracking-tight text-ink-900 mb-4">
          Vendor due diligence<br />in under 3 minutes
        </h1>
        <p className="text-lg text-ink-800/60 max-w-xl mx-auto mb-10">
          Crawls the vendor site, runs 11 parallel research queries, scores risk across 5 categories,
          and generates a branded slide deck. Fully automated.
        </p>
        <Link
          href="/app"
          className="inline-block px-8 py-3.5 rounded-lg bg-burnt-500 text-white font-medium hover:bg-burnt-600 transition-colors shadow-sm"
        >
          Start a report
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-ink-900 mb-10 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-xl bg-white border border-beige-200 shadow-sm"
            >
              <span className="text-xs font-mono text-burnt-500 font-medium">{step.num}</span>
              <h3 className="font-display text-lg text-ink-900 mt-1 mb-2">{step.title}</h3>
              <p className="text-sm text-ink-800/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-ink-900 mb-8 text-center">What you get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "GO / NO-GO Verdict", desc: "Scored across financial, quality, security, legal, and longevity." },
            { title: "11-Slide Deck", desc: "Branded presentation ready to share with stakeholders." },
            { title: "Negotiation Intel", desc: "Discount ranges, contract flexibility, leverage points." },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl bg-beige-100 border border-beige-200">
              <h3 className="font-display text-base text-ink-900 mb-1">{item.title}</h3>
              <p className="text-sm text-ink-800/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-ink-800/40 font-mono">
          ~$0.10 per report in API costs. Firecrawl + Perplexity + Claude + Gamma.
        </p>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-beige-200">
        <p className="text-xs text-ink-800/30 font-mono">Research Generator</p>
      </footer>
    </div>
  );
}
