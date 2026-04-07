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

function MockDashboard() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-surface-200 overflow-hidden max-w-4xl mx-auto">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-200 bg-surface-50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-8">
          <div className="bg-surface-100 rounded-full px-4 py-1 text-xs text-ink-400 text-center max-w-xs mx-auto">leadlens.app/research</div>
        </div>
      </div>
      {/* Dashboard content */}
      <div className="p-6 grid grid-cols-3 gap-4">
        {/* Stats row */}
        <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
          <div className="text-xs text-brand-600 font-semibold mb-1">Pipeline Value</div>
          <div className="text-2xl font-bold text-ink-900">$1.2M</div>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-brand-500">+12%</span><span className="text-xs text-ink-400">vs last month</span></div>
        </div>
        <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
          <div className="text-xs text-ink-600 font-semibold mb-1">Leads (30d)</div>
          <div className="text-2xl font-bold text-ink-900">47</div>
          <div className="h-1 bg-surface-200 rounded-full mt-2"><div className="h-1 bg-brand-400 rounded-full" style={{width: "72%"}} /></div>
        </div>
        <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
          <div className="text-xs text-ink-600 font-semibold mb-1">Closed Won</div>
          <div className="text-2xl font-bold text-ink-900">12</div>
          <div className="h-1 bg-surface-200 rounded-full mt-2"><div className="h-1 bg-brand-400 rounded-full" style={{width: "45%"}} /></div>
        </div>
        {/* Research card */}
        <div className="col-span-2 bg-white rounded-xl border border-surface-200 p-4">
          <div className="text-sm font-bold text-ink-900 mb-3">Research: Notion</div>
          <div className="space-y-2.5">
            {["Company Description", "Financials", "Pricing Intelligence", "Leadership Team", "Pain Points"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < 4 ? "bg-brand-500" : "bg-brand-200"}`}>
                  {i < 4 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-xs ${i < 4 ? "text-ink-700" : "text-ink-400"}`}>{s}</span>
                {i < 4 && <span className="text-[10px] text-brand-500 font-semibold ml-auto">Complete</span>}
                {i === 4 && <span className="text-[10px] text-ink-400 ml-auto">Processing...</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Side card */}
        <div className="bg-white rounded-xl border border-surface-200 p-4">
          <div className="text-sm font-bold text-ink-900 mb-3">Pain Points</div>
          <div className="space-y-2">
            {["Scaling engineering team", "Enterprise pricing gaps", "Competitive pressure"].map((p, i) => (
              <div key={p} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded bg-brand-50 text-brand-600 text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <span className="text-[11px] text-ink-600 leading-tight">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockResearchCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/8 border border-surface-200 overflow-hidden">
      <div className="p-5">
        <div className="text-xs font-semibold text-brand-500 mb-2">COMPANY RESEARCH</div>
        <div className="text-lg font-bold text-ink-900 mb-1">Notion</div>
        <div className="text-xs text-ink-400 mb-4">notion.so</div>
        <div className="space-y-3">
          <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
            <div className="text-[11px] font-semibold text-ink-700 mb-1">Company Description</div>
            <div className="text-[11px] text-ink-600 leading-relaxed">Notion is an all-in-one workspace for notes, docs, project management, and wikis. They serve teams of all sizes from startups to enterprises.</div>
          </div>
          <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
            <div className="text-[11px] font-semibold text-ink-700 mb-1">Leadership Team</div>
            <div className="text-[11px] text-ink-600 leading-relaxed">Ivan Zhao, CEO &amp; Co-founder. Previously at Instaread. Built first prototype in 2013.</div>
          </div>
          <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
            <div className="text-[11px] font-semibold text-brand-700 mb-1">Pain Points</div>
            <div className="text-[11px] text-ink-600 leading-relaxed">1. Scaling enterprise sales motion<br/>2. Competing with Microsoft Loop</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockToggleList() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/8 border border-surface-200 overflow-hidden">
      <div className="p-5">
        <div className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-4">Research Sections</div>
        {["Company Description", "Financials", "Pricing Intelligence", "Leadership Team", "Recent News", "Hiring", "Competitors", "Likely Pain Points"].map((s, i) => (
          <div key={s} className="flex items-center justify-between py-2.5 border-b border-surface-50 last:border-0">
            <span className="text-xs text-ink-700">{s}</span>
            <div className={`w-8 h-[18px] rounded-full relative transition-colors ${i < 6 ? "bg-brand-500" : "bg-surface-300"}`}>
              <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${i < 6 ? "left-[16px]" : "left-[2px]"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-surface-50">
      {/* Nav */}
      <nav className="bg-brand-500 sticky top-0 z-50 shadow-md shadow-brand-700/15">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="9" stroke="white" strokeWidth="3"/>
              <line x1="20" y1="20" x2="28" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span className="text-[22px] text-white tracking-tight font-bold">LeadLens</span>
          </span>
          <Link
            href="/research"
            className="btn-cta px-6 py-2.5 rounded-full bg-white text-brand-600 text-sm font-semibold"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-brand-50 pt-20 pb-0 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="animate-slide-xl">
            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-sm font-semibold">
              Sales research, automated
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-ink-900 mb-5">
              Know any company<br />
              <span className="text-brand-500">before you reach out</span>
            </h1>
            <p className="text-base sm:text-lg text-ink-600 max-w-xl mx-auto mb-10 leading-relaxed">
              Enter a company name. Get financials, leadership, hiring signals, competitors,
              and AI-generated pain points in under 2 minutes.
            </p>
            <div className="flex items-center justify-center gap-4 mb-16">
              <Link
                href="/research"
                className="btn-cta px-8 py-3.5 rounded-full bg-brand-500 text-white text-base font-semibold"
              >
                Research a company
              </Link>
              <a
                href="#how"
                className="px-6 py-3.5 rounded-full text-ink-600 font-semibold hover:text-ink-900 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
        {/* Product screenshot */}
        <div className="relative max-w-5xl mx-auto px-6 animate-slide-md" style={{ animationDelay: "0.2s" }}>
          <MockDashboard />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-50 to-transparent" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-surface-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-3">HOW IT WORKS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Four steps. Under two minutes.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group p-6 rounded-2xl bg-white border border-surface-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <span className="text-sm font-bold text-brand-600">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature: Research sections */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 animate-slide-sm">
              <div className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-3">CUSTOMIZABLE</div>
              <h2 className="text-3xl font-bold text-ink-900 mb-4">What you get</h2>
              <p className="text-base text-ink-600 leading-relaxed mb-8">
                Eight research sections, fully customizable. Toggle on what matters for your outreach and skip the rest.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SECTIONS.map((item) => (
                  <div key={item.title} className="p-3 rounded-xl bg-surface-50 border border-surface-200">
                    <h3 className="text-sm font-semibold text-ink-900 mb-0.5">{item.title}</h3>
                    <p className="text-xs text-ink-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-slide-md">
              <MockToggleList />
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Research output */}
      <section className="bg-surface-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-slide-md">
              <MockResearchCard />
            </div>
            <div className="animate-slide-sm">
              <div className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-3">AI-POWERED</div>
              <h2 className="text-3xl font-bold text-ink-900 mb-4">Deep research in seconds</h2>
              <p className="text-base text-ink-600 leading-relaxed mb-6">
                Crawls the company site, runs parallel research queries across multiple sources,
                and synthesizes actionable pain points for your outreach.
              </p>
              <ul className="space-y-3">
                {["Site crawl across 7 key pages", "Parallel research queries via Perplexity", "AI-synthesized pain points via Claude"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-ink-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-brand-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="text-2xl sm:text-3xl font-bold text-ink-900 leading-snug mb-8">
            &ldquo;What used to take me 30 minutes of manual research now takes under 2 minutes. The pain points alone are worth it.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">JE</div>
            <div className="text-left">
              <div className="text-sm font-semibold text-ink-900">Sales Team</div>
              <div className="text-xs text-ink-400">Early adopter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost + CTA */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-3">PRICING</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">Ready to research?</h2>
          <p className="text-base text-ink-600 mb-10">About $0.05 per report in API costs. No subscription required.</p>
          <Link
            href="/research"
            className="btn-cta inline-block px-8 py-4 rounded-full bg-brand-500 text-white text-base font-semibold"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="flex items-center gap-2 text-white/30">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="3"/>
              <line x1="20" y1="20" x2="28" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span className="text-base font-bold">LeadLens</span>
          </span>
          <p className="text-xs text-white/20">Sales research, automated</p>
        </div>
      </footer>
    </div>
  );
}
