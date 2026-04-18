"use client";

import Link from "next/link";
import { Storyboard, type StoryFrame } from "@/components/Storyboard";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-line)] py-2 text-sm last:border-b-0">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className="tabnum">{value}</span>
    </div>
  );
}

const FRAMES: StoryFrame[] = [
  {
    title: "An applicant reaches the NBFC",
    body: "A small-business owner applies for a ₹12L working-capital loan at an NBFC. The NBFC qualifies the lead and routes it to its co-lending partner bank under CLM-1.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          NBFC · Application intake
        </div>
        <div className="mb-4 rounded-lg border border-[var(--color-line)] p-4">
          <Row label="Applicant" value="Surya Traders Pvt Ltd" />
          <Row label="Requested amount" value="₹12,00,000" />
          <Row label="Tenor" value="36 months" />
          <Row label="NBFC credit grade" value="B+" />
        </div>
        <div className="text-xs text-[var(--color-muted)]">
          Under CLM-1, partner bank funds 80% at its own risk weight. Both
          lenders must independently underwrite.
        </div>
      </div>
    ),
  },
  {
    title: "Today: manual file transfer",
    body: "In the current workflow, the NBFC emails the applicant file to the bank. The bank's underwriter rekeys some fields, misses others, and runs its own policy. Exposure dedup happens at month-end, not at decision time.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-warn)]">
          Legacy · Pain
        </div>
        <ul className="space-y-3 text-sm">
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            📧 Applicant PDF emailed bank-side. Data residency lost.
          </li>
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            📝 Fields rekeyed into bank core. Transcription errors routine.
          </li>
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            ⏳ Two underwriting cycles in series. Decision latency 5–9 days.
          </li>
          <li className="rounded-lg border border-[var(--color-line)] p-3">
            🪞 No cross-lender exposure check until monthly reconciliation.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "With Silence: one run, two decisions",
    body: "The applicant file stays on the NBFC side. The bank's policy compiles into an MPC circuit that runs jointly against NBFC data and bank risk parameters. Two credit decisions, one evaluation pass, no file handover.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-accent)]">
          MPC · Joint evaluation
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-line)] p-4">
            <div className="text-xs text-[var(--color-muted)]">NBFC node</div>
            <div className="mt-1 text-sm font-semibold">
              Applicant file, bureau pulls, bank statements
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Data stays here
            </div>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] p-4">
            <div className="text-xs text-[var(--color-muted)]">Bank node</div>
            <div className="mt-1 text-sm font-semibold">
              Policy weights, exposure book, risk appetite
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Weights stay here
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-[var(--color-bone)] p-3 text-sm">
          MPC circuit returns: <b>Approved · ₹9.6L bank share · ₹2.4L NBFC
          share · 13.9% blended rate</b>
        </div>
      </div>
    ),
  },
  {
    title: "Exposure dedup at decision time",
    body: "Before the circuit approves, it runs a PSI over both lenders' books. If the applicant is already financed by either, the circuit aborts — or the exposure is netted automatically. No more month-end surprises.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Exposure gate · PSI
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-line)] p-3">
            <span className="text-sm">NBFC existing exposure</span>
            <span className="tabnum text-sm">₹0</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-line)] p-3">
            <span className="text-sm">Bank existing exposure</span>
            <span className="tabnum text-sm">₹3.2L (unsecured)</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-ink)] bg-[var(--color-bone)] p-3">
            <span className="text-sm font-semibold">
              Circuit decision
            </span>
            <span className="tabnum text-sm font-semibold">
              Approve · bank share netted to ₹6.4L
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Neither side sees the other&apos;s book. The circuit sees enough to
          make a safe decision.
        </p>
      </div>
    ),
  },
  {
    title: "Disbursement, books, and audit",
    body: "Each lender books only its share. The signed query trace — what the circuit saw, what each side contributed, and what left the trust boundary — is filed to both sides' audit systems and shared with the regulator on request.",
    screen: (
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Settlement · Audit
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-line)] p-4">
            <div className="text-xs text-[var(--color-muted)]">NBFC book</div>
            <div className="tabnum mt-1 text-lg font-semibold">₹2.4L</div>
            <div className="text-xs text-[var(--color-muted)]">
              20% share · 14.5% APR
            </div>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] p-4">
            <div className="text-xs text-[var(--color-muted)]">Bank book</div>
            <div className="tabnum mt-1 text-lg font-semibold">₹6.4L</div>
            <div className="text-xs text-[var(--color-muted)]">
              post-dedup share · 13.6% APR
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-[var(--color-bone)] p-3 text-xs">
          🪪 Signed audit: <span className="font-mono">cli-2026-0417-SURYA-a3f1</span> ·
          verifier: RBI / circuit attested by Silence
        </div>
      </div>
    ),
    note: "End of walkthrough. Want to pilot this on your co-lending book? Use the CTA above.",
  },
];

export function CoLendingStory() {
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
            Lending · India Co-Lending (CLM-1 / CLM-2)
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Co-Lending Joint Underwriting
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--color-muted)]">
            Five frames showing how two lenders underwrite one applicant
            together without handing over the applicant file — and book the
            split loan in one pass, with exposure dedup at decision time.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Storyboard frames={FRAMES} />
      </div>
    </div>
  );
}
