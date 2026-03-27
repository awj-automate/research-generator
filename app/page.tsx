import Link from "next/link";

const STEPS = [
  { num: "01", title: "Enter a Company", desc: "Name, domain, and any extra context about your deal." },
  { num: "02", title: "Choose Sections", desc: "Toggle which research areas matter for your outreach." },
  { num: "03", title: "AI Researches", desc: "Crawls their site, runs parallel queries, synthesizes insights." },
  { num: "04", title: "Get Your Brief", desc: "Download a report or open it directly in Google Docs." },
];

const SECTIONS = [
  { title: "Company Overview", desc: "What they do, who they serve." },
  { title: "Financials", desc: "Revenue, funding, valuation signals." },
  { title: "Pricing Intel", desc: "Tiers, enterprise costs, complaints." },
  { title: "Leadership", desc: "Key execs with background context." },
  { title: "Recent News", desc: "Launches, partnerships, events." },
  { title: "Hiring Signals", desc: "Open roles by department." },
  { title: "Competitors", desc: "Top 3 with positioning diffs." },
  { title: "Pain Points", desc: "AI-synthesized prospecting angles." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between animate-fade-in">
        <span className="font-display text-xl tracking-tight text-ink-900">LeadLens</span>
        <Link
          href="/app"
          className="px-5 py-2 rounded-lg bg-burnt-500 text-white text-sm font-medium hover:bg-burnt-600 transition-all hover:shadow-md active:scale-[0.98]"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center animate-slide-up">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-burnt-500/10 text-burnt-600 text-xs font-mono font-medium">
          Sales research, automated
        </div>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.1] tracking-tight text-ink-900 mb-5">
          Know any company<br />
          <span className="text-burnt-500">before you reach out</span>
        </h1>
        <p className="text-lg text-ink-800/50 max-w-lg mx-auto mb-10 leading-relaxed">
          Enter a company name. Get financials, leadership, hiring signals, competitors,
          and AI-generated pain points in under 2 minutes.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/app"
            className="px-8 py-3.5 rounded-xl bg-burnt-500 text-white font-medium hover:bg-burnt-600 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Research a company
          </Link>
          <a
            href="#how"
            className="px-6 py-3.5 rounded-xl text-ink-800/50 font-medium hover:text-ink-800/70 transition-colors"
          >
            How it works
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl text-ink-900 mb-3 text-center">How it works</h2>
        <p className="text-sm text-ink-800/40 text-center mb-12 font-mono">Four steps. Under two minutes.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="group p-6 rounded-2xl bg-white border border-beige-200 shadow-sm hover:shadow-md hover:border-burnt-400/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-8 h-8 rounded-lg bg-burnt-500/10 flex items-center justify-center mb-3">
                <span className="text-xs font-mono text-burnt-500 font-medium">{step.num}</span>
              </div>
              <h3 className="font-display text-lg text-ink-900 mb-2">{step.title}</h3>
              <p className="text-sm text-ink-800/45 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl text-ink-900 mb-3 text-center">What you get</h2>
        <p className="text-sm text-ink-800/40 text-center mb-12 font-mono">Eight research sections, fully customizable.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {SECTIONS.map((item) => (
            <div key={item.title} className="p-5 rounded-xl bg-beige-100/80 border border-beige-200 hover:bg-white hover:border-burnt-400/20 transition-all duration-300">
              <h3 className="font-display text-base text-ink-900 mb-1">{item.title}</h3>
              <p className="text-xs text-ink-800/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="p-10 rounded-2xl bg-white border border-beige-200 shadow-sm">
          <h2 className="font-display text-2xl text-ink-900 mb-3">Ready to research?</h2>
          <p className="text-sm text-ink-800/40 mb-6">About $0.05 per report in API costs.</p>
          <Link
            href="/app"
            className="inline-block px-8 py-3.5 rounded-xl bg-burnt-500 text-white font-medium hover:bg-burnt-600 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-beige-200">
        <p className="text-xs text-ink-800/25 font-mono">LeadLens</p>
      </footer>
    </div>
  );
}
