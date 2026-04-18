"use client";

import { useMemo, useState } from "react";
import { DemoChrome, type TraceStep } from "@/components/DemoChrome";
import { trackEvent } from "@/lib/analytics";

type NodeStatus = "idle" | "computing" | "match" | "no-match";

interface Bank {
  id: string;
  name: string;
  country: string;
  population: string;
}

const BANKS: Bank[] = [
  { id: "north", name: "Northbridge Bank", country: "UK", population: "12.4M accounts" },
  { id: "meridian", name: "Meridian Financial", country: "US", population: "21.7M accounts" },
  { id: "asteria", name: "Asteria Bank", country: "SG", population: "4.1M accounts" },
  { id: "cordillera", name: "Cordillera Group", country: "EU", population: "18.9M accounts" },
];

interface SampleQuery {
  id: string;
  fingerprint: string;
  label: string;
  matches: Record<string, { hits: number; confidence: number } | null>;
  ringSize: number;
  ringScore: "high" | "medium" | "low";
  note: string;
}

const SAMPLE_QUERIES: SampleQuery[] = [
  {
    id: "q1",
    fingerprint: "a3f1·9e02·c77b·1d4e",
    label: "Suspected mule — Northbridge investigation #4812",
    matches: {
      north: { hits: 3, confidence: 0.98 },
      meridian: { hits: 2, confidence: 0.94 },
      asteria: null,
      cordillera: { hits: 4, confidence: 0.91 },
    },
    ringSize: 9,
    ringScore: "high",
    note: "Fingerprint matches a coordinated APP-fraud pattern across 3 institutions. Device graph shows 9 linked accounts.",
  },
  {
    id: "q2",
    fingerprint: "f8c0·44ad·9b21·0e6f",
    label: "Payroll-fraud watchlist entity",
    matches: {
      north: null,
      meridian: { hits: 1, confidence: 0.82 },
      asteria: { hits: 1, confidence: 0.79 },
      cordillera: null,
    },
    ringSize: 2,
    ringScore: "medium",
    note: "Two institutions report the same signature at low volume. Recommend joint investigation before escalation.",
  },
  {
    id: "q3",
    fingerprint: "0a00·2231·7711·dcdc",
    label: "Retail control — benign account",
    matches: {
      north: null,
      meridian: null,
      asteria: null,
      cordillera: null,
    },
    ringSize: 0,
    ringScore: "low",
    note: "No cross-institution activity. Query leaves no data residue beyond the aggregate 'no match' response.",
  },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function ConsortiumFraudDemo() {
  const [selected, setSelected] = useState<string>(SAMPLE_QUERIES[0].id);
  const [runId, setRunId] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeStatus>>({});
  const [result, setResult] = useState<SampleQuery | null>(null);
  const [kAnonBudget] = useState(5);

  const query = SAMPLE_QUERIES.find((q) => q.id === selected)!;

  async function runQuery() {
    if (running) return;
    trackEvent("demo_action", { slug: "consortium-fraud", action: "run_query", query: query.id });
    setRunning(true);
    setResult(null);
    setRunId((x) => x + 1);
    setNodeStates(Object.fromEntries(BANKS.map((b) => [b.id, "computing"])));
    for (const b of BANKS) {
      await sleep(650 + Math.random() * 350);
      const m = query.matches[b.id];
      setNodeStates((prev) => ({
        ...prev,
        [b.id]: m ? "match" : "no-match",
      }));
    }
    await sleep(400);
    setResult(query);
    setRunning(false);
  }

  const trace: TraceStep[] = useMemo(() => {
    const steps: TraceStep[] = [
      {
        layer: "Client — query encoding",
        detail:
          "Fingerprint hashed client-side and blinded with an oblivious PRF. Raw identifier never leaves the analyst's workstation.",
        status: "ok",
      },
      {
        layer: "Policy engine — entitlement check",
        detail:
          "Query scope validated against consortium charter. k-anonymity floor of " +
          kAnonBudget +
          " enforced; responses below floor are suppressed to the aggregate.",
        status: "ok",
      },
      {
        layer: "MPC run — 4 consortium nodes",
        detail:
          "Each node computes the PSI locally against its own population. Only a count and a confidence tensor is returned per node. No account IDs are transmitted.",
        status: "ok",
      },
      {
        layer: "Aggregation — threshold reveal",
        detail:
          "Per-node outputs are aggregated under threshold decryption. Aggregate ring size and combined confidence are computed without unmasking per-bank contributions below the k-anonymity floor.",
        status: "ok",
      },
      {
        layer: "Data boundary audit",
        detail: result
          ? `Aggregate result returned. No raw account data, no customer identifiers, and no per-row evidence crossed any bank's trust boundary. Ring size = ${result.ringSize}.`
          : "Awaiting a query run.",
        status: result ? "ok" : "note",
      },
    ];
    return steps;
  }, [kAnonBudget, result]);

  return (
    <DemoChrome
      analyticsSlug="consortium-fraud"
      title="Consortium Fraud Console"
      industry="Financial Services · Financial Crime"
      summary="Four banks, one query, zero raw data shared. Ask whether an account fingerprint appears anywhere in the consortium — get an aggregate answer with a cryptographic audit trail, while each bank's row-level data never leaves its premises."
      architectureSummary="An MPC protocol across N bank nodes that answers joint queries with aggregate-only outputs, gated by a policy engine that enforces consortium charter rules and a k-anonymity floor."
      architectureDetail={`Inputs: a blinded fingerprint + query type selected by the analyst.

Stack:
  1. Client encodes the fingerprint via an OPRF so the raw identifier is never transmitted.
  2. A policy engine validates scope, purpose, and k-anonymity floor before authorising the run.
  3. Each bank's node runs the PSI locally against its own population — raw data stays home.
  4. Outputs are aggregated under threshold decryption. Contributions below the k-anonymity floor are collapsed into the aggregate so no single bank can be singled out on a low-hit query.
  5. The aggregate (ring size, confidence band, recommended action) returns to the analyst. A signed query trace is stored for audit.

Why MPC and not a TEE?
  A confidential-computing answer here requires all consortium banks to trust one enclave operator. In practice they do not. MPC removes the need for a shared trust anchor.`}
      trace={trace}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-5 lg:col-span-1">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Sample queries
            </div>
            <div className="space-y-2">
              {SAMPLE_QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelected(q.id);
                    setResult(null);
                    setNodeStates({});
                  }}
                  className={`w-full rounded-lg border px-3 py-3 text-left text-xs transition ${
                    selected === q.id
                      ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
                      : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                  }`}
                >
                  <div className="tabnum font-mono text-[11px] text-[var(--color-ink)]">
                    {q.fingerprint}
                  </div>
                  <div className="mt-1 text-[var(--color-muted)]">
                    {q.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Policy parameters
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-[var(--color-muted)]">Charter scope</dt>
                <dd>Financial crime — AML/APP</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-muted)]">k-anonymity floor</dt>
                <dd className="tabnum">k = {kAnonBudget}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-muted)]">Query cap</dt>
                <dd>60 / analyst / day</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-muted)]">Audit retention</dt>
                <dd>7 years (signed)</dd>
              </div>
            </dl>
          </div>
        </aside>

        <section className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  Active query
                </div>
                <div className="mt-1 font-mono text-base">
                  {query.fingerprint}
                </div>
                <div className="mt-1 text-xs text-[var(--color-muted)]">
                  {query.label}
                </div>
              </div>
              <button
                onClick={runQuery}
                disabled={running}
                className="inline-flex items-center rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-bone)] transition hover:opacity-90 disabled:opacity-40"
              >
                {running ? "Running across consortium…" : "Run joint query →"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Consortium nodes
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                Run #{runId} {running ? "· in progress" : ""}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {BANKS.map((b) => {
                const s = nodeStates[b.id] || "idle";
                const badge =
                  s === "idle"
                    ? { label: "Idle", cls: "text-[var(--color-muted)] border border-[var(--color-line)]" }
                    : s === "computing"
                      ? { label: "Computing…", cls: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" }
                      : s === "match"
                        ? { label: "Match returned", cls: "bg-[var(--color-accent)] text-[var(--color-bone)]" }
                        : { label: "No match", cls: "border border-[var(--color-line)] text-[var(--color-muted)]" };
                return (
                  <div
                    key={b.id}
                    className={`rounded-xl border p-4 transition ${
                      s === "computing"
                        ? "border-[var(--color-accent)]"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{b.name}</div>
                        <div className="text-xs text-[var(--color-muted)]">
                          {b.country} · {b.population}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div className="mt-3 border-t border-[var(--color-line)] pt-3 text-xs text-[var(--color-muted)]">
                      Local population • row-level data never leaves this node
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 transition ${
              result
                ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
                : "border-[var(--color-line)] bg-[var(--color-paper)]"
            }`}
          >
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Aggregate finding
            </div>
            {result ? (
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="text-xs text-[var(--color-muted)]">Ring size</div>
                  <div className="tabnum mt-1 text-3xl font-semibold">
                    {result.ringSize}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Combined risk
                  </div>
                  <div className="mt-1 text-3xl font-semibold uppercase">
                    {result.ringScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Institutions implicated
                  </div>
                  <div className="tabnum mt-1 text-3xl font-semibold">
                    {
                      Object.values(result.matches).filter(Boolean).length
                    }{" "}
                    / {BANKS.length}
                  </div>
                </div>
                <p className="md:col-span-3 text-sm leading-relaxed text-[var(--color-ink)]">
                  {result.note}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Run a joint query to see the aggregate. This panel only ever
                shows aggregates: no row-level account data reaches the
                analyst.
              </p>
            )}
          </div>
        </section>
      </div>
    </DemoChrome>
  );
}
