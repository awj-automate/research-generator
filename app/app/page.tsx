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

interface Synthesis {
  overallScore: string;
  categoryScores: string;
  greenFlags: string[];
  redFlags: string[];
  negotiationPoints: string[];
  recommendation: string;
  rationale: string;
}

interface FinalResult {
  deckUrl: string | null;
  cost: number;
  duration: number;
}

const LAYER_NAMES = ["Site Crawl", "Risk Checks", "Research", "Synthesis", "Deck Generation"];

export default function AppPage() {
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState("");
  const [urls, setUrls] = useState("");
  const [context, setContext] = useState("");

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [result, setResult] = useState<FinalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!companyName || !domain || !category) return;

    setRunning(true);
    setProgress([]);
    setSynthesis(null);
    setResult(null);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, domain, category, urls, context }),
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
                case "synthesis":
                  setSynthesis(data);
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
  }, [companyName, domain, category, urls, context]);

  const recBg =
    synthesis?.recommendation === "GO"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : synthesis?.recommendation === "NO-GO"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-amber-50 border-amber-200 text-amber-800";

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight text-ink-900">
          Research Generator
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Input Form */}
        {!running && !result && (
          <div>
            <h1 className="font-display text-3xl text-ink-900 mb-6">New Report</h1>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="HubSpot"
                  className="w-full px-4 py-3 rounded-lg border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/25 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                    Domain *
                  </label>
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="hubspot.com"
                    className="w-full px-4 py-3 rounded-lg border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/25 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                    Market Category *
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="CRM Software"
                    className="w-full px-4 py-3 rounded-lg border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/25 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Extra URLs <span className="text-ink-800/20">(optional, space-separated)</span>
                </label>
                <input
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="hubspot.com/trust hubspot.com/case-studies"
                  className="w-full px-4 py-3 rounded-lg border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/25 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-800/40 uppercase tracking-wider mb-1.5">
                  Additional Context <span className="text-ink-800/20">(optional)</span>
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="We are evaluating this vendor for a 3-year enterprise contract worth $500K..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-beige-200 bg-white text-sm text-ink-900 placeholder:text-ink-800/25 focus:outline-none focus:ring-2 focus:ring-burnt-500/20 focus:border-burnt-400 transition-all resize-y"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!companyName || !domain || !category}
              className="px-8 py-3 rounded-lg bg-burnt-500 text-white font-medium hover:bg-burnt-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Generate Report
            </button>
          </div>
        )}

        {/* Progress */}
        {running && (
          <div>
            <h1 className="font-display text-3xl text-ink-900 mb-2">
              Researching {companyName}
            </h1>
            <p className="text-sm text-ink-800/40 mb-8 font-mono">{domain}</p>

            <div className="space-y-3">
              {LAYER_NAMES.map((name, i) => {
                const layerItems = progress.filter((p) => p.layer === i);
                const started = layerItems.length > 0;
                const done = layerItems.some((p) => p.status === "done" && !layerItems.some((q) => q.status === "start" && q.ts > p.ts));
                const latest = layerItems[layerItems.length - 1];

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border transition-all ${
                      done
                        ? "bg-white border-beige-200"
                        : started
                        ? "bg-burnt-500/5 border-burnt-400/30"
                        : "bg-beige-100 border-beige-200 opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-burnt-500 font-medium">
                          {String(i).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium text-ink-900">{name}</span>
                      </div>
                      {done && <span className="text-xs text-emerald-600 font-mono">done</span>}
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

            {/* Show synthesis as soon as it arrives */}
            {synthesis && !result && (
              <div className="mt-8">
                <SynthesisPanel synthesis={synthesis} recBg={recBg} />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-3xl text-ink-900">{companyName}</h1>
              <button
                onClick={() => {
                  setResult(null);
                  setSynthesis(null);
                  setProgress([]);
                }}
                className="text-xs text-ink-800/40 hover:text-ink-800/60 font-mono transition-colors"
              >
                New report
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="p-3 rounded-lg bg-white border border-beige-200 text-center">
                <div className="text-lg font-display text-ink-900">{result.duration}s</div>
                <div className="text-[10px] font-mono text-ink-800/40 uppercase">Duration</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-beige-200 text-center">
                <div className="text-lg font-display text-ink-900">${result.cost}</div>
                <div className="text-[10px] font-mono text-ink-800/40 uppercase">API Cost</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-beige-200 text-center">
                {result.deckUrl ? (
                  <a
                    href={result.deckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-display text-burnt-500 hover:text-burnt-600 underline underline-offset-2"
                  >
                    Open Deck
                  </a>
                ) : (
                  <div className="text-lg font-display text-ink-800/30">No deck</div>
                )}
                <div className="text-[10px] font-mono text-ink-800/40 uppercase">Presentation</div>
              </div>
            </div>

            {synthesis && <SynthesisPanel synthesis={synthesis} recBg={recBg} />}
          </div>
        )}
      </div>
    </div>
  );
}

function SynthesisPanel({ synthesis, recBg }: { synthesis: Synthesis; recBg: string }) {
  return (
    <div className="space-y-4">
      {/* Verdict */}
      <div className={`p-5 rounded-xl border ${recBg}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-2xl">{synthesis.recommendation}</span>
          <span className="font-mono text-sm">{synthesis.overallScore}</span>
        </div>
        <p className="text-sm">{synthesis.rationale}</p>
        <p className="text-xs mt-2 opacity-60 font-mono">{synthesis.categoryScores}</p>
      </div>

      {/* Flags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
          <h3 className="text-xs font-mono text-emerald-700 uppercase tracking-wider mb-2">Green Flags</h3>
          <ul className="space-y-1">
            {synthesis.greenFlags.map((f, i) => (
              <li key={i} className="text-sm text-emerald-800">{f}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
          <h3 className="text-xs font-mono text-red-700 uppercase tracking-wider mb-2">Red Flags</h3>
          <ul className="space-y-1">
            {synthesis.redFlags.map((f, i) => (
              <li key={i} className="text-sm text-red-800">{f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Negotiation */}
      <div className="p-4 rounded-lg bg-beige-100 border border-beige-200">
        <h3 className="text-xs font-mono text-ink-800/50 uppercase tracking-wider mb-2">Negotiation Points</h3>
        <ul className="space-y-1">
          {synthesis.negotiationPoints.map((p, i) => (
            <li key={i} className="text-sm text-ink-800/70">{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
