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
    <div className="bg-ds-card rounded-card shadow-2xl shadow-black/10 border border-ds-border overflow-hidden max-w-4xl mx-auto card-glow">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ds-border bg-ds-surface">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-8">
          <div className="bg-ds-bg rounded-full px-4 py-1 text-xs text-ds-muted text-center max-w-xs mx-auto">leadlens.app/research</div>
        </div>
      </div>
      {/* Dashboard content */}
      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="text-xs text-ds-primary font-semibold mb-1">Pipeline Value</div>
          <div className="text-2xl font-bold text-ds-heading">$1.2M</div>
          <div className="flex items-center gap-1 mt-1"><span className="text-xs text-ds-primary">+12%</span><span className="text-xs text-ds-muted">vs last month</span></div>
        </div>
        <div className="bg-ds-surface rounded-xl p-4 border border-ds-border">
          <div className="text-xs text-ds-muted font-semibold mb-1">Leads (30d)</div>
          <div className="text-2xl font-bold text-ds-heading">47</div>
          <div className="h-1 bg-ds-bg rounded-full mt-2"><div className="h-1 bg-ds-primary rounded-full" style={{width: "72%"}} /></div>
        </div>
        <div className="bg-ds-surface rounded-xl p-4 border border-ds-border">
          <div className="text-xs text-ds-muted font-semibold mb-1">Closed Won</div>
          <div className="text-2xl font-bold text-ds-heading">12</div>
          <div className="h-1 bg-ds-bg rounded-full mt-2"><div className="h-1 bg-ds-primary rounded-full" style={{width: "45%"}} /></div>
        </div>
        <div className="col-span-2 bg-ds-card rounded-xl border border-ds-border p-4">
          <div className="text-sm font-bold text-ds-heading mb-3">Research: Notion</div>
          <div className="space-y-2.5">
            {["Company Description", "Financials", "Pricing Intelligence", "Leadership Team", "Pain Points"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < 4 ? "bg-ds-primary" : "bg-ds-primary-light/40"}`}>
                  {i < 4 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-xs ${i < 4 ? "text-ds-text" : "text-ds-muted"}`}>{s}</span>
                {i < 4 && <span className="text-[10px] text-ds-primary font-semibold ml-auto">Complete</span>}
                {i === 4 && <span className="text-[10px] text-ds-muted ml-auto">Processing...</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-ds-card rounded-xl border border-ds-border p-4">
          <div className="text-sm font-bold text-ds-heading mb-3">Pain Points</div>
          <div className="space-y-2">
            {["Scaling engineering team", "Enterprise pricing gaps", "Competitive pressure"].map((p, i) => (
              <div key={p} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded bg-blue-50 text-ds-primary text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <span className="text-[11px] text-ds-text leading-tight">{p}</span>
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
    <div className="bg-ds-card rounded-card shadow-xl shadow-black/8 border border-ds-border overflow-hidden">
      <div className="p-5">
        <div className="text-xs font-semibold text-ds-primary mb-2">COMPANY RESEARCH</div>
        <div className="text-lg font-bold text-ds-heading mb-1">Notion</div>
        <div className="text-xs text-ds-muted mb-4">notion.so</div>
        <div className="space-y-3">
          <div className="p-3 bg-ds-surface rounded-lg border border-ds-border">
            <div className="text-[11px] font-semibold text-ds-text mb-1">Company Description</div>
            <div className="text-[11px] text-ds-muted leading-relaxed">Notion is an all-in-one workspace for notes, docs, project management, and wikis. They serve teams of all sizes from startups to enterprises.</div>
          </div>
          <div className="p-3 bg-ds-surface rounded-lg border border-ds-border">
            <div className="text-[11px] font-semibold text-ds-text mb-1">Leadership Team</div>
            <div className="text-[11px] text-ds-muted leading-relaxed">Ivan Zhao, CEO &amp; Co-founder. Previously at Instaread. Built first prototype in 2013.</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-[11px] font-semibold text-ds-primary mb-1">Pain Points</div>
            <div className="text-[11px] text-ds-text leading-relaxed">1. Scaling enterprise sales motion<br/>2. Competing with Microsoft Loop</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockToggleList() {
  return (
    <div className="bg-ds-card rounded-card shadow-xl shadow-black/8 border border-ds-border overflow-hidden">
      <div className="p-5">
        <div className="text-xs font-semibold text-ds-text uppercase tracking-wider mb-4">Research Sections</div>
        {["Company Description", "Financials", "Pricing Intelligence", "Leadership Team", "Recent News", "Hiring", "Competitors", "Likely Pain Points"].map((s, i) => (
          <div key={s} className="flex items-center justify-between py-2.5 border-b border-ds-surface last:border-0">
            <span className="text-xs text-ds-text">{s}</span>
            <div className={`w-8 h-[18px] rounded-full relative transition-colors ${i < 6 ? "bg-ds-primary" : "bg-ds-subtle"}`}>
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
    <div className="min-h-screen overflow-hidden bg-ds-bg">
      {/* Nav */}
      <nav className="bg-ds-heading sticky top-0 z-50 shadow-md">
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
            className="btn-cta px-6 py-2.5 rounded-button bg-ds-primary text-white text-sm font-semibold"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-ds-surface pt-20 pb-0 overflow-hidden relative" style={{ perspective: "1200px" }}>
        {/* Floating orbs */}
        <div className="orb orb-blue" style={{ width: 300, height: 300, top: -60, left: -80 }} />
        <div className="orb orb-purple" style={{ width: 250, height: 250, top: 100, right: -50 }} />
        <div className="orb orb-cyan" style={{ width: 200, height: 200, bottom: 60, left: "30%" }} />

        <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
          <div className="opacity-0 animate-hero-pill" style={{ animationDelay: "0.1s" }}>
            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-ds-primary text-sm font-semibold badge-float">
              Sales research, automated
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-ds-heading mb-5 opacity-0 animate-hero-title" style={{ animationDelay: "0.25s" }}>
            Know any company<br />
            <span className="hero-gradient-text">before you reach out</span>
          </h1>
          <p className="text-base sm:text-lg text-ds-text max-w-xl mx-auto mb-10 leading-relaxed opacity-0 animate-hero-subtitle" style={{ animationDelay: "0.5s" }}>
            Enter a company name. Get financials, leadership, hiring signals, competitors,
            and AI-generated pain points in under 2 minutes.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16 opacity-0 animate-hero-buttons" style={{ animationDelay: "0.7s" }}>
            <Link
              href="/research"
              className="btn-cta px-8 py-3.5 rounded-button bg-ds-primary text-white text-base font-semibold"
            >
              Research a company
            </Link>
            <a
              href="#how"
              className="px-6 py-3.5 rounded-button text-ds-text font-semibold hover:text-ds-heading transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto px-6 opacity-0 animate-hero-dashboard" style={{ animationDelay: "0.9s" }}>
          <MockDashboard />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ds-bg to-transparent" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-ds-bg py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-ds-primary uppercase tracking-widest mb-3">HOW IT WORKS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ds-heading mb-3">Four steps. Under two minutes.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group p-6 rounded-card bg-ds-card border border-ds-border shadow-sm tilt-card animated-border"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-ds-primary group-hover:text-white transition-colors">
                  <span className="text-sm font-bold text-ds-primary group-hover:text-white">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-ds-heading mb-2">{step.title}</h3>
                <p className="text-sm text-ds-text leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature: Research sections */}
      <section className="bg-ds-card py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 animate-slide-sm">
              <div className="text-xs font-semibold text-ds-primary uppercase tracking-widest mb-3">CUSTOMIZABLE</div>
              <h2 className="text-3xl font-bold text-ds-heading mb-4">What you get</h2>
              <p className="text-base text-ds-text leading-relaxed mb-8">
                Eight research sections, fully customizable. Toggle on what matters for your outreach and skip the rest.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SECTIONS.map((item) => (
                  <div key={item.title} className="p-3 rounded-xl bg-ds-surface border border-ds-border">
                    <h3 className="text-sm font-semibold text-ds-heading mb-0.5">{item.title}</h3>
                    <p className="text-xs text-ds-muted">{item.desc}</p>
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
      <section className="bg-ds-bg py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-slide-md">
              <MockResearchCard />
            </div>
            <div className="animate-slide-sm">
              <div className="text-xs font-semibold text-ds-primary uppercase tracking-widest mb-3">AI-POWERED</div>
              <h2 className="text-3xl font-bold text-ds-heading mb-4">Deep research in seconds</h2>
              <p className="text-base text-ds-text leading-relaxed mb-6">
                Crawls the company site, runs parallel research queries across multiple sources,
                and synthesizes actionable pain points for your outreach.
              </p>
              <ul className="space-y-3">
                {["Site crawl across 7 key pages", "Parallel research queries via Perplexity", "AI-synthesized pain points via Claude"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-ds-primary flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-ds-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-ds-surface py-20 relative overflow-hidden">
        <div className="orb orb-blue" style={{ width: 200, height: 200, top: -40, right: "10%" }} />
        <div className="orb orb-purple" style={{ width: 180, height: 180, bottom: -30, left: "15%" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <blockquote className="text-2xl sm:text-3xl font-bold text-ds-heading leading-snug mb-8">
            &ldquo;What used to take me 30 minutes of manual research now takes under 2 minutes. The pain points alone are worth it.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ds-primary/20 flex items-center justify-center text-ds-primary font-bold text-sm">JE</div>
            <div className="text-left">
              <div className="text-sm font-semibold text-ds-heading">Sales Team</div>
              <div className="text-xs text-ds-muted">Early adopter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost + CTA */}
      <section className="bg-ds-card py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-ds-primary uppercase tracking-widest mb-3">PRICING</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-ds-heading mb-4">Ready to research?</h2>
          <p className="text-base text-ds-text mb-10">About $0.05 per report in API costs. No subscription required.</p>
          <Link
            href="/research"
            className="btn-cta inline-block px-8 py-4 rounded-button bg-ds-primary text-white text-base font-semibold"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ds-heading py-10">
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
