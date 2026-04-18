"use client";

import Link from "next/link";
import { Storyboard, type StoryFrame } from "@/components/Storyboard";

const FRAMES: StoryFrame[] = [
  {
    title: "A Singapore MSME, an Indian lender",
    body: "An Indian bank wants to finance a Singapore-incorporated export MSME. The applicant's business data — GST filings, bank statements, customs records — lives under Singapore data-residency law. It cannot legally cross the border.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Scenario
        </div>
        <div className="rounded-lg border border-[var(--color-line)] p-4">
          <div className="text-sm font-semibold">PacRim Exports Pte Ltd</div>
          <div className="mt-1 text-xs text-[var(--color-muted)]">
            Singapore · 24 months trading · electronics exports to IN/PH/VN
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-[var(--color-muted)]">Sought</div>
              <div className="tabnum">SGD 480,000 trade loan</div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-muted)]">From</div>
              <div>HarbourCredit Bank (Mumbai)</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Today: the data doesn't travel, so the money doesn't either",
    body: "Bank asks for filings. MSME says their accountant won't release them abroad. Bank asks for an inbound-permissible redaction. Weeks pass. Most cross-border MSME loans die here.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-warn)]">
          Legacy · Pain
        </div>
        <ul className="space-y-3 text-sm">
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            🗂 Data-residency rules block raw filings at the Singapore border.
          </li>
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            📑 Attempted workaround: notarised summary. Bank risk team does not
            trust a third-party summary.
          </li>
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            💤 Decision latency: 6–12 weeks. Majority never close.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "MPC: inference crosses the border, not data",
    body: "Bank's scoring model compiles into an MPC circuit that runs in place over source-jurisdiction data. The circuit returns a decision + reason codes. The underlying filings never leave Singapore.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-accent)]">
          Data residency · preserved
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-line)] p-4">
            <div className="text-xs text-[var(--color-muted)]">Singapore node</div>
            <div className="mt-1 text-sm font-semibold">
              GST · bank statements · customs · ACRA filings
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              never exported
            </div>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] p-4">
            <div className="text-xs text-[var(--color-muted)]">India node</div>
            <div className="mt-1 text-sm font-semibold">
              Scoring model weights · policy · exposure limits
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              never exported
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-[var(--color-bone)] p-3 text-sm">
          Output: <b>Approved · SGD 420,000 · 90-day revolving</b> · reason
          codes: trade-velocity healthy, tenor-matched receivables, customs
          consistent.
        </div>
      </div>
    ),
  },
  {
    title: "Regulator-grade audit, both sides",
    body: "MAS and RBI both get a cryptographic attestation: which data was consulted, which model ran, and what crossed the border. The attestation is self-verifying and does not leak any underlying figures.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Attestation
        </div>
        <div className="space-y-2">
          <div className="rounded-lg border border-[var(--color-line)] p-3 text-sm">
            <div className="text-[var(--color-muted)]">Circuit hash</div>
            <div className="tabnum font-mono">
              scm-2026-0417-b91d·9e03·f720·a8c4
            </div>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] p-3 text-sm">
            <div className="text-[var(--color-muted)]">
              Crossed the border
            </div>
            <div>Decision, amount, reason codes — nothing else</div>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] p-3 text-sm">
            <div className="text-[var(--color-muted)]">Verified by</div>
            <div>MAS sandbox · RBI observer</div>
          </div>
        </div>
      </div>
    ),
    note: "End of walkthrough. Silence has an existing whitepaper with Finternet and Proxtera on this flow — link on request.",
  },
];

export function CrossBorderMsmeStory() {
  return (
    <div>
      <div className="bg-[var(--color-warn)] text-[var(--color-bone)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[11px] uppercase tracking-wider">
          <span>Walkthrough — illustrative flow with synthetic data</span>
          <Link href="/" className="underline">
            Back to Possibilities
          </Link>
        </div>
      </div>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-bone)]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            Cross-Border Finance · Finternet / Proxtera model
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Cross-Border MSME Credit Inference
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--color-muted)]">
            Data stays home. The inference crosses the border. The loan
            happens.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Storyboard frames={FRAMES} />
      </div>
    </div>
  );
}
