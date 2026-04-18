"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export interface TraceStep {
  layer: string;
  detail: string;
  status: "ok" | "note";
}

interface Props {
  title: string;
  industry: string;
  summary: string;
  architectureSummary: string;
  architectureDetail: string;
  trace: TraceStep[];
  children: React.ReactNode;
  pilotCtaHref?: string;
  pilotCtaLabel?: string;
  analyticsSlug?: string;
}

export function DemoChrome({
  title,
  industry,
  summary,
  architectureSummary,
  architectureDetail,
  trace,
  children,
  pilotCtaHref = "mailto:hello@silencelaboratories.com",
  pilotCtaLabel = "Pilot this with us",
  analyticsSlug,
}: Props) {
  const [tab, setTab] = useState<"demo" | "architecture" | "trace">("demo");

  useEffect(() => {
    if (analyticsSlug) trackEvent("demo_load", { slug: analyticsSlug });
  }, [analyticsSlug]);

  const onTabSwitch = (t: "demo" | "architecture" | "trace") => {
    setTab(t);
    if (analyticsSlug)
      trackEvent("demo_tab_switch", { slug: analyticsSlug, tab: t });
  };

  const onPilotClick = () => {
    if (analyticsSlug)
      trackEvent("pilot_cta_click", {
        slug: analyticsSlug,
        source: "demo",
      });
  };

  return (
    <div>
      <div className="bg-[var(--color-warn)] text-[var(--color-bone)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[11px] uppercase tracking-wider">
          <span>
            Prototype — synthetic data — not a live Silence service
          </span>
          <Link href="/" className="underline">
            Back to Possibilities
          </Link>
        </div>
      </div>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-bone)]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            {industry}
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            <a
              href={pilotCtaHref}
              onClick={onPilotClick}
              className="inline-flex items-center self-start rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs font-medium text-[var(--color-bone)] hover:opacity-90"
            >
              {pilotCtaLabel} →
            </a>
          </div>
          <p className="mt-4 max-w-3xl text-[var(--color-muted)]">{summary}</p>
        </div>
      </section>

      <div className="border-b border-[var(--color-line)] bg-[var(--color-paper)]">
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          {(["demo", "architecture", "trace"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onTabSwitch(t)}
              className={`border-b-2 px-4 py-3 text-xs uppercase tracking-wider transition ${
                tab === t
                  ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {t === "demo"
                ? "Demo"
                : t === "architecture"
                  ? "Architecture"
                  : "Query trace"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {tab === "demo" && <div>{children}</div>}

        {tab === "architecture" && (
          <div className="max-w-3xl">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              How it works
            </div>
            <p className="text-lg leading-relaxed">{architectureSummary}</p>
            <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-sm leading-relaxed text-[var(--color-muted)] whitespace-pre-wrap">
              {architectureDetail}
            </div>
          </div>
        )}

        {tab === "trace" && (
          <div className="max-w-3xl">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Query trace — what ran, where, and what crossed the boundary
            </div>
            <ol className="space-y-3">
              {trace.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
                >
                  <div className="tabnum mt-0.5 text-xs text-[var(--color-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">{s.layer}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                          s.status === "ok"
                            ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                            : "border border-[var(--color-line)] text-[var(--color-muted)]"
                        }`}
                      >
                        {s.status === "ok" ? "verified" : "note"}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--color-muted)]">
                      {s.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
