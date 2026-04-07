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

/** Strip markdown artifacts so content renders as clean plain text */
function cleanContent(raw: string): string {
  return raw
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove Perplexity citation markers like [1], [2, 3], [1][2]
    .replace(/\[[\d,\s]+\]/g, "")
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^\|.*\|$/gm, "")
    .replace(/^[-|: ]+$/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

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

  function renderContent(raw: string) {
    const cleaned = cleanContent(raw);
    return cleaned
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, "<br>") }} />
      ));
  }

  function buildDocHtml(name: string, sectionData: SectionData[], pp: PainPointsData | null): string {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${name} - Sales Research Brief</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#3F3F46}h1{font-size:24px;border-bottom:2px solid #09090B;padding-bottom:8px;color:#09090B}h2{font-size:18px;margin-top:28px;color:#09090B}p,li{font-size:13px;line-height:1.6}ol{margin:8px 0;padding-left:20px}</style></head><body>`;
    html += `<h1>${name} - Sales Research Brief</h1>`;

    for (const section of sectionData) {
      html += `<h2>${section.title}</h2>`;
      const cleaned = cleanContent(section.content);
      const paragraphs = cleaned.split(/\n\n+/).filter(Boolean);
      for (const p of paragraphs) {
        html += `<p>${p.replace(/\n/g, "<br>")}</p>`;
      }
    }

    if (pp && pp.points.length > 0) {
      html += `<h2>Likely Pain Points</h2><ol>`;
      for (const point of pp.points) {
        html += `<li>${cleanContent(point)}</li>`;
      }
      html += `</ol>`;
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
    <div className="min-h-screen bg-ds-bg">
      {/* Nav */}
      <nav className="bg-ds-heading sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between animate-fade-in">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="9" stroke="white" strokeWidth="3"/>
              <line x1="20" y1="20" x2="28" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span className="text-[22px] text-white tracking-tight font-bold">LeadLens</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 pb-20">
        {/* Input Form */}
        {!running && !result && (
          <div className="animate-slide-md">
            <h1 className="text-3xl font-bold text-ds-heading mb-1">New Research</h1>
            <p className="text-sm text-ds-muted mb-8">Enter a company to research</p>

            <div className="luminous-frame bg-ds-card p-6 sm:p-8 mb-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-ds-text uppercase tracking-wider mb-1.5">
                    Company Name *
                  </label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Notion"
                    className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ds-text uppercase tracking-wider mb-1.5">
                    Domain *
                  </label>
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="notion.so"
                    className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ds-text uppercase tracking-wider mb-1.5">
                    Extra URLs <span className="text-ds-subtle normal-case">(optional)</span>
                  </label>
                  <input
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder="notion.so/customers notion.so/enterprise"
                    className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ds-text uppercase tracking-wider mb-1.5">
                    Context <span className="text-ds-subtle normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="We sell data infrastructure tools and want to see if they are a good prospect..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Section Toggles */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-ds-text uppercase tracking-wider mb-3">
                Research Sections
              </label>
              <div className="luminous-frame bg-ds-card overflow-hidden divide-y divide-ds-surface">
                {ALL_SECTIONS.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className={`text-sm transition-colors ${enabledSections[section.id] ? "text-ds-heading font-medium" : "text-ds-subtle"}`}>
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
              className="w-full px-8 py-4 rounded-button bg-ds-primary text-white font-semibold hover:bg-ds-primary-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-ds-primary/20 hover:shadow-xl hover:shadow-ds-primary/30 active:scale-[0.99]"
            >
              Research Company
            </button>
          </div>
        )}

        {/* Progress */}
        {running && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-ds-heading mb-1">
              Researching {companyName}
            </h1>
            <p className="text-sm text-ds-muted mb-8">{domain}</p>

            <div className="space-y-3 stagger-children">
              {LAYER_NAMES.map((name, i) => {
                const layerItems = progress.filter((p) => p.layer === i);
                const started = layerItems.length > 0;
                const done = layerItems.some((p) => p.status === "done" && !layerItems.some((q) => q.status === "start" && q.ts > p.ts));
                const latest = layerItems[layerItems.length - 1];

                return (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      done
                        ? "bg-ds-card border-ds-border shadow-sm"
                        : started
                        ? "bg-blue-50 border-blue-200 shadow-md shadow-ds-primary/5 animate-pulse-glow"
                        : "bg-ds-surface border-ds-border opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          done ? "bg-blue-100 text-ds-primary" : started ? "bg-ds-primary text-white" : "bg-ds-bg text-ds-subtle"
                        }`}>
                          {String(i).padStart(2, "0")}
                        </div>
                        <span className="text-sm font-semibold text-ds-heading">{name}</span>
                      </div>
                      {done && (
                        <span className="text-xs text-ds-primary font-semibold animate-scale-in">Complete</span>
                      )}
                      {started && !done && (
                        <svg className="animate-spin h-4 w-4 text-ds-primary" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                    </div>
                    {latest && (
                      <p className="text-xs text-ds-muted mt-2 ml-11 truncate">
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
          <div className="animate-slide-md">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-ds-heading">{companyName}</h1>
                <p className="text-sm text-ds-muted">{domain}</p>
              </div>
              <button
                onClick={reset}
                className="text-sm text-ds-muted hover:text-ds-heading transition-colors px-4 py-2 rounded-button border border-ds-border hover:bg-ds-card hover:shadow-sm"
              >
                New research
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-ds-card border border-ds-border shadow-sm text-center">
                <div className="text-2xl font-bold text-ds-heading">{result.duration}s</div>
                <div className="text-xs text-ds-muted uppercase font-semibold mt-1">Duration</div>
              </div>
              <div className="p-4 rounded-xl bg-ds-card border border-ds-border shadow-sm text-center">
                <div className="text-2xl font-bold text-ds-heading">${result.cost}</div>
                <div className="text-xs text-ds-muted uppercase font-semibold mt-1">API Cost</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={() => downloadDoc(companyName, sections, painPoints)}
                className="flex-1 px-4 py-3.5 rounded-button bg-ds-primary text-white font-semibold hover:bg-ds-primary-dark transition-all text-sm shadow-lg shadow-ds-primary/20 hover:shadow-xl active:scale-[0.99]"
              >
                Download .doc
              </button>
              <button
                onClick={() => openInGoogleDocs(companyName, sections, painPoints)}
                className="flex-1 px-4 py-3.5 rounded-button bg-ds-card border border-ds-border text-ds-heading font-semibold hover:bg-ds-surface transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                Open in Google Docs
              </button>
            </div>

            {/* Research Sections */}
            <div className="space-y-4 stagger-children">
              {sections.map((section) => (
                <div key={section.id} className="luminous-frame bg-ds-card p-6">
                  <h3 className="text-xl font-bold text-ds-heading mb-3">{section.title}</h3>
                  <div className="text-sm text-ds-text leading-relaxed space-y-2">
                    {renderContent(section.content)}
                  </div>
                </div>
              ))}

              {/* Pain Points */}
              {painPoints && painPoints.points.length > 0 && (
                <div className="luminous-frame bg-blue-50 p-6 border-blue-200">
                  <h3 className="text-xl font-bold text-ds-heading mb-4">Likely Pain Points</h3>
                  <ul className="space-y-3">
                    {painPoints.points.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ds-text leading-relaxed">
                        <span className="w-6 h-6 rounded-lg bg-ds-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {cleanContent(point)}
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
