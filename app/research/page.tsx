"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface ProgressItem {
  layer: number;
  label: string;
  status: string;
  detail?: string;
  ts: number;
}

interface SectionData {
  id: string;
  title: string;
  content: string;
}

interface PainPointsData {
  points: string[];
  raw: string;
}

interface FinalResult {
  cost: number;
  duration: number;
}

const ALL_SECTIONS = [
  { id: "description", title: "Company Description" },
  { id: "financials", title: "Financials" },
  { id: "pricing", title: "Pricing Intelligence" },
  { id: "leadership", title: "Leadership Team" },
  { id: "news", title: "Recent News" },
  { id: "hiring", title: "Hiring" },
  { id: "competitors", title: "Competitors" },
  { id: "painpoints", title: "Likely Pain Points" },
];

const LAYER_NAMES = ["Site Crawl", "Research", "Pain Points"];

export default function AppPage() {
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [urls, setUrls] = useState("");
  const [context, setContext] = useState("");
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_SECTIONS.map((s) => [s.id, true]))
  );

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [painPoints, setPainPoints] = useState<PainPointsData | null>(null);
  const [result, setResult] = useState<FinalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const toggleSection = (id: string) => {
    setEnabledSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = useCallback(async () => {
    if (!companyName || !domain) return;

    setRunning(true);
    setProgress([]);
    setSections([]);
    setPainPoints(null);
    setResult(null);
    setError(null);

    abortRef.current = new AbortController();

    const activeSections = Object.entries(enabledSections)
      .filter(([, v]) => v)
      .map(([k]) => k);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, domain, urls, context, sections: activeSections }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Request failed");
        setRunning(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ") && eventType) {
            try {
              const data = JSON.parse(line.slice(6));
              switch (eventType) {
                case "progress":
                  setProgress((prev) => [...prev, { ...data, ts: Date.now() }]);
                  break;
                case "sections":
                  setSections(data);
                  break;
                case "painpoints":
                  setPainPoints(data);
                  break;
                case "result":
                  setResult(data);
                  break;
                case "error":
                  setError(data.message);
                  break;
              }
            } catch {}
            eventType = "";
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
    }

    setRunning(false);
  }, [companyName, domain, urls, context, enabledSections]);

  function buildDocHtml(name: string, sectionData: SectionData[], pp: PainPointsData | null): string {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${name} - Sales Research Brief</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#222}h1{font-size:24px;border-bottom:2px solid #333;padding-bottom:8px}h2{font-size:18px;margin-top:28px;color:#444}p,li{font-size:13px;line-height:1.6}ul{margin:8px 0;padding-left:20px}</style></head><body>`;
    html += `<h1>${name} - Sales Research Brief</h1>`;

    for (const section of sectionData) {
      html += `<h2>${section.title}</h2>`;
      const paragraphs = section.content.split(/\n\n+/).filter(Boolean);
      for (const p of paragraphs) {
        html += `<p>${p.replace(/\n/g, "<br>")}</p>`;
      }
    }

    if (pp && pp.points.length > 0) {
      html += `<h2>Likely Pain Points</h2><ul>`;
      for (const point of pp.points) {
        html += `<li>${point}</li>`;
      }
      html += `</ul>`;
    }

    html += `</body></html>`;
    return html;
  }

  function downloadDoc(name: string, sectionData: SectionData[], pp: PainPointsData | null) {
    const html = buildDocHtml(name, sectionData, pp);
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_Research_Brief.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openInGoogleDocs(name: string, sectionData: SectionData[], pp: PainPointsData | null) {
    const html = buildDocHtml(name, sectionData, pp);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_Research_Brief.html`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => {
      window.open("https://docs.google.com/document/u/0/?tgif=d", "_blank");
    }, 500);
  }

  const reset = () => {
    setResult(null);
    setSections([]);
    setPainPoints(null);
    setProgress([]);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between animate-fade-in">
        <Link href="/" className="font-display text-xl tracking-tight text-ink-900 hover:text-burnt-500 transition-colors">
          LeadLens
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Input Form */}
        {!running && !result && (
          <div className="animate-slide-up">
            <h1 className="font-display text-3xl text-ink-900 mb-1">New Research</h1>
            <p className="text-sm text-ink-800/40 mb-8 font-mono">Enter a company to research</p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Notion"
                  className="w-full px-4 py-3 rounded-xl border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/20 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Domain *
                </label>
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="notion.so"
                  className="w-full px-4 py-3 rounded-xl border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/20 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Extra URLs <span className="text-ink-800/20">(optional)</span>
                </label>
                <input
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="notion.so/customers notion.so/enterprise"
                  className="w-full px-4 py-3 rounded-xl border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/20 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Context <span className="text-ink-800/20">(optional)</span>
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="We sell data infrastructure tools and want to see if they are a good prospect..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/20 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all resize-y"
                />
              </div>
            </div>

            {/* Section Toggles */}
            <div className="mb-8">
              <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-3">
                Research Sections
              </label>
              <div className="rounded-xl border border-beige-200 bg-white overflow-hidden divide-y divide-beige-100">
                {ALL_SECTIONS.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-beige-50/50 transition-colors cursor-pointer"
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className={`text-sm transition-colors ${enabledSections[section.id] ? "text-ink-900" : "text-ink-800/30"}`}>
                      {section.title}
                    </span>
                    <div className={`toggle-switch ${enabledSections[section.id] ? "active" : ""}`} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!companyName || !domain}
              className="w-full px-8 py-3.5 rounded-xl bg-burnt-500 text-white font-medium hover:bg-burnt-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              Research Company
            </button>
          </div>
        )}

        {/* Progress */}
        {running && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl text-ink-900 mb-1">
              Researching {companyName}
            </h1>
            <p className="text-sm text-ink-800/40 mb-8 font-mono">{domain}</p>

            <div className="space-y-3 stagger-children">
              {LAYER_NAMES.map((name, i) => {
                const layerItems = progress.filter((p) => p.layer === i);
                const started = layerItems.length > 0;
                const done = layerItems.some((p) => p.status === "done" && !layerItems.some((q) => q.status === "start" && q.ts > p.ts));
                const latest = layerItems[layerItems.length - 1];

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      done
                        ? "bg-white border-beige-200"
                        : started
                        ? "bg-burnt-500/5 border-burnt-400/30 shadow-sm"
                        : "bg-beige-100 border-beige-200 opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-burnt-500 font-medium w-5">
                          {String(i).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium text-ink-900">{name}</span>
                      </div>
                      {done && (
                        <span className="text-xs text-emerald-600 font-mono animate-scale-in">done</span>
                      )}
                      {started && !done && (
                        <svg className="animate-spin h-3.5 w-3.5 text-burnt-500" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                    </div>
                    {latest && (
                      <p className="text-xs text-ink-800/40 mt-1 font-mono truncate">
                        {latest.label}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 animate-scale-in">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl text-ink-900">{companyName}</h1>
                <p className="text-sm text-ink-800/40 font-mono">{domain}</p>
              </div>
              <button
                onClick={reset}
                className="text-xs text-ink-800/40 hover:text-ink-800/60 font-mono transition-colors px-3 py-1.5 rounded-lg hover:bg-beige-100"
              >
                New research
              </button>
            </div>

            {/* Stats + Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white border border-beige-200 text-center">
                <div className="text-lg font-display text-ink-900">{result.duration}s</div>
                <div className="text-[10px] font-mono text-ink-800/40 uppercase">Duration</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-beige-200 text-center">
                <div className="text-lg font-display text-ink-900">${result.cost}</div>
                <div className="text-[10px] font-mono text-ink-800/40 uppercase">API Cost</div>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={() => downloadDoc(companyName, sections, painPoints)}
                className="flex-1 px-4 py-3 rounded-xl bg-burnt-500 text-white font-medium hover:bg-burnt-600 transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                Download .doc
              </button>
              <button
                onClick={() => openInGoogleDocs(companyName, sections, painPoints)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-beige-200 text-ink-900 font-medium hover:bg-beige-50 transition-all text-sm hover:shadow-sm active:scale-[0.99]"
              >
                Open in Google Docs
              </button>
            </div>

            {/* Research Sections */}
            <div className="space-y-4 stagger-children">
              {sections.map((section) => (
                <div key={section.id} className="p-5 rounded-xl bg-white border border-beige-200">
                  <h3 className="font-display text-lg text-ink-900 mb-3">{section.title}</h3>
                  <div className="text-sm text-ink-800/70 leading-relaxed space-y-2">
                    {section.content.split(/\n\n+/).filter(Boolean).map((p, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, "<br>") }} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Pain Points */}
              {painPoints && painPoints.points.length > 0 && (
                <div className="p-5 rounded-xl bg-burnt-500/5 border border-burnt-400/20">
                  <h3 className="font-display text-lg text-ink-900 mb-3">Likely Pain Points</h3>
                  <ul className="space-y-2">
                    {painPoints.points.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink-800/70 leading-relaxed">
                        <span className="text-burnt-500 font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
