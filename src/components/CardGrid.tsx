"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Card } from "@/lib/cards";
import { trackEvent } from "@/lib/analytics";

function StatusPill({ tier, label }: { tier: Card["tier"]; label: string }) {
  const styles =
    tier === "hero"
      ? "bg-[var(--color-accent)] text-[var(--color-bone)]"
      : tier === "storyboard"
        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
        : "border border-[var(--color-line)] bg-transparent text-[var(--color-muted)]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles}`}
    >
      {label}
    </span>
  );
}

function cardHref(card: Card): string {
  if (card.external_url) return `/interstitial/${card.slug}`;
  if (card.demo_route) return card.demo_route;
  return `/concept/${card.slug}`;
}

function destinationType(card: Card): "demo" | "storyboard" | "concept" | "interstitial" {
  if (card.external_url) return "interstitial";
  if (card.tier === "hero") return "demo";
  if (card.tier === "storyboard") return "storyboard";
  return "concept";
}

export function CardGrid({ cards }: { cards: Card[] }) {
  const industries = useMemo(
    () => ["All", ...Array.from(new Set(cards.map((c) => c.industry))).sort()],
    [cards]
  );
  const [industry, setIndustry] = useState("All");
  const [tier, setTier] = useState<"All" | Card["tier"]>("All");

  const filtered = cards.filter(
    (c) =>
      (industry === "All" || c.industry === industry) &&
      (tier === "All" || c.tier === tier)
  );

  const clearFilters = () => {
    setIndustry("All");
    setTier("All");
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-[var(--color-line)] pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Industry
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-2 py-1 text-xs text-[var(--color-ink)]"
          >
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Type
          <div className="flex gap-1">
            {(["All", "hero", "storyboard", "concept"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`rounded-full px-3 py-1 text-[11px] ${
                  tier === t
                    ? "bg-[var(--color-ink)] text-[var(--color-bone)]"
                    : "border border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                {t === "All"
                  ? "All"
                  : t === "hero"
                    ? "Live Demo"
                    : t === "storyboard"
                      ? "Walkthrough"
                      : "Concept"}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-auto text-xs text-[var(--color-muted)]">
          {filtered.length} / {cards.length} shown
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-[var(--color-paper)] p-10 text-center">
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            No cards match this filter combination
          </div>
          <p className="mx-auto max-w-md text-sm text-[var(--color-muted)]">
            Silence Possibilities is an editorial stream — we add cards as
            customer workflows and pilot conversations uncover them. If your
            industry or workflow isn&apos;t here yet, that may be the exact
            reason to tell us about it.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={clearFilters}
              className="rounded-full border border-[var(--color-line)] px-4 py-1.5 text-xs hover:border-[var(--color-ink)]"
            >
              Clear filters
            </button>
            <a
              href="mailto:hello@silencelaboratories.com?subject=Silence%20Possibilities%20—%20Use%20Case%20Idea"
              className="rounded-full bg-[var(--color-ink)] px-4 py-1.5 text-xs font-medium text-[var(--color-bone)] hover:opacity-90"
            >
              Propose a use case →
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const href = cardHref(c);
            const dest = destinationType(c);

            return (
              <Link
                key={c.slug}
                href={href}
                onClick={() =>
                  trackEvent("card_click", {
                    slug: c.slug,
                    tier: c.tier,
                    industry: c.industry,
                    destination_type: dest,
                  })
                }
                className="group flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-ink)] hover:shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <StatusPill tier={c.tier} label={c.status_label} />
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                    {c.industry}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold leading-snug group-hover:underline">
                  {c.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
                  {c.summary}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {c.mpc_primitives.slice(0, 3).map((p) => (
                    <span
                      key={p}
                      className="rounded-md border border-[var(--color-line)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-[var(--color-muted)]">{c.persona}</span>
                  <span className="font-medium text-[var(--color-ink)]">
                    {dest === "interstitial" ? "Open prototype →" : "Enter →"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
