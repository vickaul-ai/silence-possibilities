"use client";

import { useMemo, useState } from "react";
import { DemoChrome, type TraceStep } from "@/components/DemoChrome";

type Phase = "idle" | "blinding" | "exchange" | "intersect" | "aggregate" | "done";

interface Row {
  id: string;
  segment: string;
  spendBand: string;
}

function synthRows(prefix: string, seed: number, n: number): Row[] {
  const segments = ["Everyday", "Premier", "Affluent", "SME-Owner", "Private"];
  const spendBands = ["$0–500", "$500–2k", "$2k–10k", "$10k–40k", "$40k+"];
  const rows: Row[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idNum = ((s >> 4) & 0xffffff).toString(16).padStart(6, "0");
    const segIdx = s % segments.length;
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const spendIdx = s % spendBands.length;
    rows.push({
      id: `${prefix}·${idNum}`,
      segment: segments[segIdx],
      spendBand: spendBands[spendIdx],
    });
  }
  return rows;
}

const RETAILER_ROWS = synthRows("rtl", 42, 8);
const BANK_ROWS = synthRows("bnk", 137, 8);

interface Query {
  id: string;
  label: string;
  detail: string;
  kind: "intersect" | "aggregate" | "segment";
  result: {
    primary: string;
    primaryLabel: string;
    supporting: Array<{ label: string; value: string }>;
    note: string;
    segments?: Array<{ name: string; value: string; share: string; suppressed?: boolean }>;
  };
}

const QUERIES: Query[] = [
  {
    id: "overlap",
    label: "How many of my customers are also your customers?",
    detail: "Plain intersection count across blinded identifiers. No row-level data exchanged.",
    kind: "intersect",
    result: {
      primary: "1.24M",
      primaryLabel: "customers in both populations",
      supporting: [
        { label: "Retailer A total", value: "4.2M" },
        { label: "Bank B total", value: "8.9M" },
        { label: "Overlap share (of Retailer A)", value: "29.4%" },
      ],
      note: "Intersection size is the only number that left either node. Which customers overlap is known to neither party — the pseudonyms prove membership without revealing identity.",
    },
  },
  {
    id: "avg-spend",
    label: "Among shared customers, what's their average card spend at merchants like me?",
    detail: "Threshold aggregation over spend records, keyed to intersection members. Aggregate only.",
    kind: "aggregate",
    result: {
      primary: "$2,140",
      primaryLabel: "avg monthly card spend at Retailer A category",
      supporting: [
        { label: "Shared customers", value: "1.24M" },
        { label: "Bank B-wide baseline", value: "$1,060" },
        { label: "Uplift vs baseline", value: "+102%" },
      ],
      note: "Only the aggregate leaves Bank B. Individual card spend rows never crossed the boundary. Retailer A learned a population-level number, not a row-level one.",
    },
  },
  {
    id: "ltv-segment",
    label: "Which segment of shared customers has the highest LTV?",
    detail: "Segmented threshold aggregation with k-anonymity floor (k ≥ 50).",
    kind: "segment",
    result: {
      primary: "Private",
      primaryLabel: "highest-LTV shared segment",
      supporting: [
        { label: "k-anonymity floor", value: "k = 50" },
        { label: "Segments computed", value: "5" },
        { label: "Segments suppressed", value: "1 (below floor)" },
      ],
      note: "Segments below k=50 are suppressed and collapsed into the aggregate — no single customer can be re-identified through segment-level queries.",
      segments: [
        { name: "Private", value: "$8,420 LTV", share: "4% of overlap" },
        { name: "Affluent", value: "$3,910 LTV", share: "17% of overlap" },
        { name: "Premier", value: "$2,220 LTV", share: "31% of overlap" },
        { name: "SME-Owner", value: "$2,050 LTV", share: "12% of overlap" },
        { name: "Everyday", value: "$780 LTV", share: "36% of overlap" },
        { name: "—", value: "suppressed", share: "k < 50", suppressed: true },
      ],
    },
  },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function CleanRoomDemo() {
  const [selected, setSelected] = useState<string>(QUERIES[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Query | null>(null);
  const [runId, setRunId] = useState(0);

  const query = QUERIES.find((q) => q.id === selected)!;

  async function runQuery() {
    if (running) return;
    setRunning(true);
    setResult(null);
    setRunId((x) => x + 1);
    setPhase("blinding");
    await sleep(650);
    setPhase("exchange");
    await sleep(650);
    setPhase("intersect");
    await sleep(650);
    if (query.kind !== "intersect") {
      setPhase("aggregate");
      await sleep(650);
    }
    setPhase("done");
    setResult(query);
    setRunning(false);
  }

  const trace: TraceStep[] = useMemo(() => {
    const r = result?.result;
    return [
      {
        layer: "Client-side encoding — OPRF blinding",
        detail:
          "Each party hashes its customer identifiers and blinds them with an Oblivious PRF keyed by a party-local secret. The blinded tokens are pseudonyms: they prove membership without revealing identity, even to the counterparty running the protocol.",
        status: "ok",
      },
      {
        layer: "Protocol exchange — PSI",
        detail:
          "Blinded token sets are exchanged. The intersection of the two sets is computed over ciphertext. At no point does either party see the counterparty's raw customer identifiers, and neither side can reverse a blinded token back to a raw identifier.",
        status: "ok",
      },
      {
        layer: query.kind === "intersect" ? "Output — intersection size" : "Threshold aggregation",
        detail:
          query.kind === "intersect"
            ? "The protocol emits a single number: the cardinality of the intersection. Which specific customers overlap is known to neither party."
            : "For each intersection member, the counterparty's attribute (spend, LTV, segment) is summed under threshold decryption. Individual values never leak — only the aggregate crosses.",
        status: "ok",
      },
      {
        layer: "k-anonymity gate",
        detail:
          query.kind === "segment"
            ? "Segments below the configured floor (k=50) are suppressed and folded into a catch-all bucket. No single customer can be re-identified through segment-level queries."
            : "This query type returns a population aggregate, not a segment breakdown. The k-anonymity floor is still enforced on any downstream segmentation.",
        status: "ok",
      },
      {
        layer: "Data boundary audit",
        detail: r
          ? `The counterparty received exactly: ${r.primary} (${r.primaryLabel}) plus the supporting aggregates listed. No raw customer identifiers, no individual spend rows, no segment memberships below k, no row-level attributes crossed the boundary.`
          : "Awaiting a query run.",
        status: r ? "ok" : "note",
      },
    ];
  }, [query, result]);

  return (
    <DemoChrome
      title="Data Clean Room"
      industry="Data Collaboration · Retail × Banking"
      summary="Two companies measure the overlap and joint behavior of their customer bases without either handing over its customer list. The intersection is computed where the data lives — the lists never move."
      architectureSummary="A two-party PSI protocol with threshold aggregation for joint metrics and a k-anonymity gate for segmentation. Each party runs a node that holds its own list. The counterparty only ever sees aggregates."
      architectureDetail={`Stack:
  1. Each party hashes its customer identifiers and blinds them with an OPRF. The OPRF key is party-local — the counterparty cannot compute blinded tokens for identifiers it does not already hold.
  2. Blinded token sets are exchanged and the intersection is computed in ciphertext. This is the classical ECDH-style PSI primitive with modern optimizations for large sets.
  3. For joint metrics (avg spend, LTV), each party's attribute values for intersection members are summed under threshold decryption. No intermediate per-row plaintext is ever seen by the counterparty.
  4. A k-anonymity gate filters segment-level outputs. Any segment smaller than k is suppressed and collapsed into the aggregate.
  5. The protocol returns the number(s) the analyst asked for — and nothing else. A signed query trace is written for audit.

How this differs from a TEE-based clean room (Snowflake, AWS Clean Rooms, confidential-computing enclaves):
  — A TEE clean room asks both parties to upload their data into one operator's enclave. The security claim rests entirely on attestation of that single operator's silicon and code path.
  — In practice, counsel at each party has to clear that upload. Many do not, or do only after months of review and with narrow scope.
  — PSI removes the upload step entirely. The computation is bilateral. There is no enclave operator to audit because there is no enclave operator.
  — This matters most in the cases where the counterparty is a direct competitor or a heavily regulated counterparty, which is most of them.`}
      trace={trace}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_260px_1fr]">
        <Party
          label="Retailer A"
          subtitle="4.2M customers · loyalty programme"
          rows={RETAILER_ROWS}
          phase={phase}
          side="left"
        />

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Overlap query
            </div>
            <div className="space-y-2">
              {QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelected(q.id);
                    setResult(null);
                    setPhase("idle");
                  }}
                  className={`w-full rounded-lg border px-3 py-3 text-left text-xs transition ${
                    selected === q.id
                      ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
                      : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                  }`}
                >
                  <div className="font-medium text-[var(--color-ink)]">
                    {q.label}
                  </div>
                  <div className="mt-1 text-[var(--color-muted)]">
                    {q.detail}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={runQuery}
              disabled={running}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-bone)] transition hover:opacity-90 disabled:opacity-40"
            >
              {running
                ? phase === "blinding"
                  ? "Blinding identifiers…"
                  : phase === "exchange"
                    ? "Exchanging tokens…"
                    : phase === "intersect"
                      ? "Computing intersection…"
                      : phase === "aggregate"
                        ? "Aggregating…"
                        : "Running…"
                : "Run joint query →"}
            </button>
            <div className="mt-3 text-[11px] text-[var(--color-muted)]">
              Run #{runId} · k-anonymity floor k = 50
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Protocol channel
            </div>
            <ol className="space-y-2 text-[11px]">
              <ProtocolStep
                label="OPRF blinding (both sides, local)"
                active={phase === "blinding"}
                done={["exchange", "intersect", "aggregate", "done"].includes(phase)}
              />
              <ProtocolStep
                label="PSI token exchange"
                active={phase === "exchange"}
                done={["intersect", "aggregate", "done"].includes(phase)}
              />
              <ProtocolStep
                label="Intersection computed"
                active={phase === "intersect"}
                done={["aggregate", "done"].includes(phase)}
              />
              <ProtocolStep
                label="Threshold aggregation"
                active={phase === "aggregate"}
                done={phase === "done"}
                skipped={query.kind === "intersect"}
              />
              <ProtocolStep label="Result returned" active={false} done={phase === "done"} />
            </ol>
            <div className="mt-3 border-t border-[var(--color-line)] pt-3 text-[11px] text-[var(--color-muted)]">
              Only blinded tokens and aggregate values cross this channel. Raw
              customer data stays local to each party.
            </div>
          </div>
        </aside>

        <Party
          label="Bank B"
          subtitle="8.9M customers · retail banking"
          rows={BANK_ROWS}
          phase={phase}
          side="right"
        />
      </div>

      <div className="mt-6">
        <div
          className={`rounded-2xl border p-5 transition ${
            result
              ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
              : "border-[var(--color-line)] bg-[var(--color-paper)]"
          }`}
        >
          <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            Aggregate answer
          </div>
          {result ? (
            <div className="space-y-5">
              <div className="grid gap-6 md:grid-cols-4">
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {result.result.primaryLabel}
                  </div>
                  <div className="tabnum mt-1 text-3xl font-semibold">
                    {result.result.primary}
                  </div>
                </div>
                {result.result.supporting.map((s) => (
                  <div key={s.label}>
                    <div className="text-xs text-[var(--color-muted)]">
                      {s.label}
                    </div>
                    <div className="tabnum mt-1 text-xl font-semibold">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              {result.result.segments ? (
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                    Segments
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {result.result.segments.map((seg, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${
                          seg.suppressed
                            ? "border-dashed border-[var(--color-line)] text-[var(--color-muted)]"
                            : "border-[var(--color-line)]"
                        }`}
                      >
                        <div className="font-medium">{seg.name}</div>
                        <div className="flex items-center gap-3">
                          <span className="tabnum">{seg.value}</span>
                          <span className="text-[var(--color-muted)]">
                            {seg.share}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                {result.result.note}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">
              Pick a query and run it. The result appears here — the raw rows
              on either side never will.
            </p>
          )}
        </div>
      </div>
    </DemoChrome>
  );
}

function Party({
  label,
  subtitle,
  rows,
  phase,
  side,
}: {
  label: string;
  subtitle: string;
  rows: Row[];
  phase: Phase;
  side: "left" | "right";
}) {
  const blinding = phase === "blinding";
  return (
    <div
      className={`rounded-2xl border bg-[var(--color-paper)] p-5 transition ${
        blinding ? "border-[var(--color-accent)]" : "border-[var(--color-line)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-[var(--color-muted)]">{subtitle}</div>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
            blinding
              ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
              : "border border-[var(--color-line)] text-[var(--color-muted)]"
          }`}
        >
          {blinding ? "Blinding…" : "Local node"}
        </span>
      </div>
      <div className="mt-4 border-t border-[var(--color-line)] pt-3 text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
        Customer sample · never leaves this node
      </div>
      <div className="mt-2 max-h-64 space-y-1 overflow-hidden">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-md border border-[var(--color-line)] px-3 py-2 text-[11px]"
          >
            <span className="tabnum font-mono text-[var(--color-ink)]">
              {r.id}
            </span>
            <span className="text-[var(--color-muted)]">{r.segment}</span>
            <span className="tabnum text-[var(--color-muted)]">
              {r.spendBand}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] leading-relaxed text-[var(--color-muted)]">
        Row-level data stays on this party&apos;s node. The counterparty never
        sees customer identifiers, segment memberships, or spend rows — only
        the aggregates they asked for.
      </div>
    </div>
  );
}

function ProtocolStep({
  label,
  active,
  done,
  skipped,
}: {
  label: string;
  active: boolean;
  done: boolean;
  skipped?: boolean;
}) {
  const dot = skipped
    ? "border border-dashed border-[var(--color-line)]"
    : done
      ? "bg-[var(--color-accent)]"
      : active
        ? "bg-[var(--color-accent-soft)] border border-[var(--color-accent)]"
        : "border border-[var(--color-line)]";
  return (
    <li className="flex items-start gap-2">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      <span
        className={`${
          skipped
            ? "line-through text-[var(--color-muted)]"
            : active
              ? "text-[var(--color-ink)]"
              : done
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-muted)]"
        }`}
      >
        {label}
      </span>
    </li>
  );
}
