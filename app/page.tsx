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
      {/* Dark Hero Section */}
      <div className="bg-navy-900 relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(43,178,76,0.08)_0%,_transparent_60%)]" />

        {/* Nav */}
        <nav className="relative max-w-6xl mx-auto px-6 py-6 flex items-center justify-between animate-fade-in">
          <span className="text-xl font-bold text-white flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="9" stroke="#2bb24c" strokeWidth="3"/>
              <line x1="20" y1="20" x2="28" y2="28" stroke="#2bb24c" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            LeadLens
          </span>
          <Link
            href="/research"
            className="px-5 py-2.5 rounded-full bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-all hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.97]"
          >
            Launch App
          </Link>
        </nav>

        {/* Hero */}
        <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-28 text-center">
          <div className="animate-slide-xl">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/20 text-brand-400 text-sm font-medium">
              Sales research, automated
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white mb-6">
              Know any company<br />
              <span className="text-brand-400">before you reach out</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
              Enter a company name. Get financials, leadership, hiring signals, competitors,
              and AI-generated pain points in under 2 minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/research"
                className="px-8 py-4 rounded-full bg-brand-500 text-white text-base font-semibold hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.97]"
              >
                Research a company
              </Link>
              <a
                href="#how"
                className="px-6 py-4 rounded-full text-white/50 font-medium hover:text-white/80 transition-colors border border-white/10 hover:border-white/20"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* Bottom edge shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      </div>

      {/* How it works */}
      <section id="how" className="bg-surface-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-900 mb-3">How it works</h2>
            <p className="text-sm text-ink-600">Four steps. Under two minutes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group p-7 rounded-2xl bg-white border border-surface-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <span className="text-sm font-bold text-brand-600">{step.num}</span>
                </div>
                <h3 className="font-display text-lg text-ink-900 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get - green tint background */}
      <section className="bg-brand-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-900 mb-3">What you get</h2>
            <p className="text-sm text-ink-600">Eight research sections, fully customizable.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {SECTIONS.map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-200/50 hover:bg-white hover:shadow-md transition-all duration-300">
                <h3 className="font-display text-base text-ink-900 mb-1">{item.title}</h3>
                <p className="text-xs text-ink-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(43,178,76,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Ready to research?</h2>
          <p className="text-white/40 mb-8">About $0.05 per report in API costs.</p>
          <Link
            href="/research"
            className="inline-block px-8 py-4 rounded-full bg-brand-500 text-white text-base font-semibold hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.97]"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs text-white/25 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="3"/>
              <line x1="20" y1="20" x2="28" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            LeadLens
          </p>
        </div>
      </footer>
    </div>
  );
}
