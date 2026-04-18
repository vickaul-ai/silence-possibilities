"use client";

import { useMemo, useState } from "react";
import { DemoChrome, type TraceStep } from "@/components/DemoChrome";

type Phase = "idle" | "policy" | "collect" | "aggregate" | "done" | "blocked";
type CustodianStatus = "idle" | "waiting" | "signed" | "held";

interface Key {
  id: string;
  label: string;
  curve: string;
  purpose: string;
  threshold: number;
  custodians: string[];
  policy: {
    perTxLimit?: string;
    dailyLimit?: string;
    window?: string;
    allowlist?: string;
    velocity?: string;
    chains?: string;
  };
}

const KEYS: Key[] = [
  {
    id: "hot-eth",
    label: "prod-hot-wallet-eth",
    curve: "secp256k1 · ECDSA",
    purpose: "ETH / ERC-20 outbound, business hours",
    threshold: 3,
    custodians: ["ops-sg", "finance-sg", "risk-uk", "legal-us", "audit-ch"],
    policy: {
      perTxLimit: "≤ $5M per transaction",
      dailyLimit: "≤ $40M per 24h",
      window: "08:00–20:00 SGT, Mon–Fri",
      allowlist: "247 addresses (treasury ops)",
      velocity: "≤ 30 tx / hour",
      chains: "Ethereum, Polygon, Arbitrum",
    },
  },
  {
    id: "cold-usdc",
    label: "treasury-usdc-cold",
    curve: "secp256k1 · ECDSA",
    purpose: "Cold-storage USDC treasury sweep",
    threshold: 3,
    custodians: ["treasury-sg", "finance-sg", "risk-uk", "audit-ch"],
    policy: {
      perTxLimit: "≤ $25M per sweep",
      dailyLimit: "≤ $25M per 24h",
      window: "10:00–16:00 SGT, Mon–Thu",
      allowlist: "6 internal treasury addresses",
      velocity: "≤ 2 sweeps / day",
      chains: "Ethereum, Solana",
    },
  },
  {
    id: "mtls-ca",
    label: "signing-key-compliance-mtls",
    curve: "P-256 · ECDSA",
    purpose: "mTLS certificate signing (Raidiam pattern)",
    threshold: 2,
    custodians: ["compliance-ca", "platform-ca", "audit-ca"],
    policy: {
      perTxLimit: "1 cert / request",
      dailyLimit: "≤ 500 certs / 24h",
      window: "always-on",
      allowlist: "issuer SAN whitelist (32 domains)",
      velocity: "≤ 60 certs / minute",
    },
  },
  {
    id: "val-sol",
    label: "validator-sol-epoch",
    curve: "Ed25519",
    purpose: "Solana validator block signatures",
    threshold: 2,
    custodians: ["val-east", "val-west", "val-central"],
    policy: {
      perTxLimit: "1 block",
      dailyLimit: "epoch cap enforced",
      window: "always-on",
      velocity: "≤ 4 sig / slot",
      chains: "Solana mainnet",
    },
  },
  {
    id: "payroll",
    label: "payroll-stablecoin",
    curve: "secp256k1 · ECDSA",
    purpose: "USDC payroll batch",
    threshold: 2,
    custodians: ["hr-sg", "finance-sg", "ops-sg", "audit-ch"],
    policy: {
      perTxLimit: "≤ $2M per batch",
      dailyLimit: "≤ $8M per 24h",
      window: "last business day of month, 09:00–18:00",
      allowlist: "employee payroll accounts (registered)",
      velocity: "1 batch / month",
    },
  },
];

interface Action {
  id: string;
  keyId: string;
  summary: string;
  detail: string;
  amount?: string;
  destination?: string;
  outcome: "approve" | "block";
  blockReason?: string;
}

const ACTIONS: Action[] = [
  {
    id: "a1",
    keyId: "hot-eth",
    summary: "Sign $4.2M ETH transfer — routine ops payment",
    detail: "Outbound to 0xB3f1…a94 (counterparty on allowlist)",
    amount: "$4,200,000",
    destination: "0xB3f1…a94 ✓ allowlist",
    outcome: "approve",
  },
  {
    id: "a2",
    keyId: "hot-eth",
    summary: "Sign $41M ETH transfer — exceeds per-tx cap",
    detail: "Policy engine blocks before ceremony begins",
    amount: "$41,000,000",
    destination: "0xB3f1…a94 ✓ allowlist",
    outcome: "block",
    blockReason: "Per-transaction limit breach · requested $41M > $5M cap. No signing ceremony initiated.",
  },
  {
    id: "a3",
    keyId: "cold-usdc",
    summary: "Sign USDC treasury sweep at 23:10 SGT",
    detail: "Cold-storage sweep outside approved time window",
    amount: "$12,000,000",
    destination: "bc1q…7x9 ✓ internal",
    outcome: "block",
    blockReason: "Time-window breach · request at 23:10 SGT outside 10:00–16:00 Mon–Thu window. Ceremony not initiated.",
  },
  {
    id: "a4",
    keyId: "mtls-ca",
    summary: "Rotate mTLS cert for api.example.com",
    detail: "Threshold-signed certificate, no HSM involved",
    destination: "SAN: api.example.com ✓ issuer allowlist",
    outcome: "approve",
  },
  {
    id: "a5",
    keyId: "val-sol",
    summary: "Sign Solana block @ slot 312,904,188",
    detail: "Validator hot path, 2-of-3 quorum",
    outcome: "approve",
  },
  {
    id: "a6",
    keyId: "payroll",
    summary: "Run monthly payroll batch — 4,112 employees",
    detail: "Scheduled end-of-month batch, within velocity cap",
    amount: "$1,870,400",
    destination: "4,112 registered payroll accounts",
    outcome: "approve",
  },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function fakeHex(len: number, seed: number) {
  const chars = "abcdef0123456789";
  let out = "";
  let s = seed;
  for (let i = 0; i < len; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out += chars[s % chars.length];
  }
  return out;
}

export function KeyVaultDemo() {
  const [selectedKeyId, setSelectedKeyId] = useState<string>(KEYS[0].id);
  const [selectedActionId, setSelectedActionId] = useState<string>(ACTIONS[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const [custodianStates, setCustodianStates] = useState<Record<string, CustodianStatus>>({});
  const [result, setResult] = useState<{
    action: Action;
    signatureFragment?: string;
    blockReason?: string;
    participating: string[];
  } | null>(null);
  const [runId, setRunId] = useState(0);

  const selectedKey = KEYS.find((k) => k.id === selectedKeyId)!;
  const selectedAction = ACTIONS.find((a) => a.id === selectedActionId)!;
  const availableActions = ACTIONS.filter((a) => a.keyId === selectedKeyId);

  async function runAction() {
    if (running) return;
    setRunning(true);
    setResult(null);
    setCustodianStates(Object.fromEntries(selectedKey.custodians.map((c) => [c, "idle"])));
    setRunId((x) => x + 1);
    setPhase("policy");
    await sleep(700);

    if (selectedAction.outcome === "block") {
      setPhase("blocked");
      setResult({
        action: selectedAction,
        blockReason: selectedAction.blockReason,
        participating: [],
      });
      setRunning(false);
      return;
    }

    setPhase("collect");
    const quorum = selectedKey.custodians.slice(0, selectedKey.threshold);
    setCustodianStates(
      Object.fromEntries(
        selectedKey.custodians.map((c) => [c, quorum.includes(c) ? "waiting" : "held"]),
      ),
    );

    for (const c of quorum) {
      await sleep(450 + Math.random() * 300);
      setCustodianStates((prev) => ({ ...prev, [c]: "signed" }));
    }

    setPhase("aggregate");
    await sleep(500);
    setPhase("done");
    setResult({
      action: selectedAction,
      signatureFragment: "0x" + fakeHex(64, runId * 9301 + selectedAction.id.charCodeAt(0)),
      participating: quorum,
    });
    setRunning(false);
  }

  const trace: TraceStep[] = useMemo(() => {
    const key = selectedKey;
    const action = result?.action ?? selectedAction;
    const blocked = result?.blockReason != null;
    const signed = result?.signatureFragment != null;
    const steps: TraceStep[] = [
      {
        layer: "Policy engine — pre-ceremony evaluation",
        detail:
          "Request evaluated against " +
          key.label +
          " policy (per-tx limit, daily limit, time window, allowlist, velocity). Decision is made BEFORE any signing ceremony begins — rejects consume no MPC cycles and leak no approval context.",
        status: "ok",
      },
      {
        layer: "Share custody — per-node",
        detail: `Each of ${key.custodians.length} operator nodes holds exactly one share of ${key.label}. Any ${key.threshold} can jointly sign; fewer than ${key.threshold} learn nothing.`,
        status: "ok",
      },
      {
        layer: "Signing ceremony — DKLS23 t-of-n",
        detail: signed
          ? `Quorum of ${key.threshold}/${key.custodians.length} participated: ${result?.participating.join(", ")}. Each node produced a partial signature from its share. The private key was NOT reconstructed — the final signature was assembled from partials.`
          : blocked
            ? "Skipped — policy engine rejected before ceremony initiation."
            : "Awaiting an action.",
        status: signed ? "ok" : "note",
      },
      {
        layer: "Coordinator view",
        detail: signed
          ? `The coordinator observed: partial signatures from each participating node, the final aggregated signature (${result?.signatureFragment?.slice(0, 12)}…), and the policy evaluation log. It did NOT observe shares, and cannot reconstruct the private key.`
          : blocked
            ? "The coordinator observed only the policy rejection decision and the request envelope. No ceremony was initiated, no partials produced."
            : "No ceremony observed yet.",
        status: signed || blocked ? "ok" : "note",
      },
      {
        layer: "Data that does not exist",
        detail:
          "The reconstructed private key is never held by any party, at any time, in any form. There is no key-escrow material. There is no 'break-glass' procedure that assembles it. The only path to a signature is the " +
          key.threshold +
          "-of-" +
          key.custodians.length +
          " ceremony.",
        status: "ok",
      },
      {
        layer: "Audit record",
        detail: blocked
          ? "Signed rejection log written: who requested, which policy rule fired, timestamp, request envelope hash. No transaction occurred."
          : signed
            ? `Signed audit record written: request envelope, policy evaluation evidence, quorum roster, partial signature commitments, final signature. Retention: 7 years under institutional custody policy.`
            : "No record yet.",
        status: blocked || signed ? "ok" : "note",
      },
    ];
    return steps;
  }, [selectedKey, selectedAction, result]);

  return (
    <DemoChrome
      title="MPC Key Vault Console"
      industry="Digital Assets · Institutional Custody"
      summary="A signing-key vault where the private key never exists in one place — not on an HSM, not in an enclave, not in any single operator's control. Policies run before the ceremony; rejects cost nothing. This is what replaces single-operator custody."
      architectureSummary="A t-of-n threshold signing network (DKLS23) with a pre-ceremony policy engine. Each key exists only as shares held by independent operator nodes. The private key is never reconstructed — not even at signing time."
      architectureDetail={`Stack:
  1. Key generation via distributed DKG — each operator node derives its share locally. No dealer, no trusted setup, no moment when the whole key exists in one place.
  2. Pre-ceremony policy engine — every request is evaluated against per-key policy (limits, windows, allowlists, velocity). Rejects end here, before any signing cycles are spent.
  3. Approved requests trigger a DKLS23 t-of-n ceremony. A threshold of operator nodes each contribute a partial signature derived from their share. Nodes may run inside TEEs (GCP Confidential Space, etc.) for node-level integrity, but the threshold property holds regardless.
  4. Partial signatures are aggregated into a standard ECDSA / EdDSA signature, indistinguishable from a single-party signature to any verifier on-chain or off-chain.
  5. Audit record includes signed rejection logs (for blocked requests) and signed approval records with quorum roster + policy evidence (for signed requests). Retention 7 years.

How this differs from an HSM-backed vault:
  — An HSM holds the whole private key. Compromise the HSM operator, compromise the key. Policy is enforced by the HSM firmware or the API in front of it, not by a cryptographic quorum. A single malicious insider with vault access can exfiltrate or misuse keys.

How this differs from a single-enclave (TEE / confidential-computing) vault:
  — A single-enclave vault narrows trust to one enclave operator and the silicon vendor's attestation chain. It is strictly better than plaintext, but it is still a single point of compromise. Attestation bugs, side channels, or a coerced operator still break it.

How MPC threshold signing differs from both:
  — No party ever holds the whole key. Compromise of any single node — HSM, TEE, or otherwise — compromises at most one share. Signing requires an adversary to compromise t independent operator domains simultaneously. That is the cryptographic property these other models do not have.

Note on TEE usage:
  Silence uses TEEs (GCP Confidential Space, etc.) for node-level integrity and attestation. The argument is not 'MPC instead of TEE' — it is 'MPC on top of TEE-attested nodes' vs. 'trust a single TEE'. The multiplicative-trust gain is the whole point.`}
      trace={trace}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-5 lg:col-span-1">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Keys in the vault
            </div>
            <div className="space-y-2">
              {KEYS.map((k) => (
                <button
                  key={k.id}
                  onClick={() => {
                    setSelectedKeyId(k.id);
                    const first = ACTIONS.find((a) => a.keyId === k.id);
                    if (first) setSelectedActionId(first.id);
                    setResult(null);
                    setPhase("idle");
                    setCustodianStates({});
                  }}
                  className={`w-full rounded-lg border px-3 py-3 text-left text-xs transition ${
                    selectedKeyId === k.id
                      ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
                      : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[11px] text-[var(--color-ink)]">
                      {k.label}
                    </div>
                    <span className="tabnum rounded border border-[var(--color-line)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)]">
                      {k.threshold}-of-{k.custodians.length}
                    </span>
                  </div>
                  <div className="mt-1 text-[var(--color-muted)]">
                    {k.curve}
                  </div>
                  <div className="mt-1 text-[var(--color-muted)]">
                    {k.purpose}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Policy · {selectedKey.label}
            </div>
            <dl className="space-y-2 text-xs">
              {Object.entries(selectedKey.policy).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="shrink-0 capitalize text-[var(--color-muted)]">
                    {k.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 border-t border-[var(--color-line)] pt-3 text-[11px] leading-relaxed text-[var(--color-muted)]">
              Policy is evaluated <span className="font-semibold">before</span>{" "}
              the signing ceremony begins. Rejected requests never consume a
              ceremony.
            </div>
          </div>
        </aside>

        <section className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Try a signing action
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {availableActions.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedActionId(a.id);
                    setResult(null);
                    setPhase("idle");
                    setCustodianStates({});
                  }}
                  className={`rounded-lg border px-3 py-3 text-left text-xs transition ${
                    selectedActionId === a.id
                      ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
                      : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-[var(--color-ink)]">
                      {a.summary}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                        a.outcome === "approve"
                          ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                          : "bg-[var(--color-warn)] text-[var(--color-bone)]"
                      }`}
                    >
                      {a.outcome === "approve" ? "should sign" : "should block"}
                    </span>
                  </div>
                  <div className="mt-1 text-[var(--color-muted)]">
                    {a.detail}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-4">
              <div className="text-xs text-[var(--color-muted)]">
                Run #{runId}
                {running
                  ? phase === "policy"
                    ? " · evaluating policy"
                    : phase === "collect"
                      ? " · collecting quorum"
                      : phase === "aggregate"
                        ? " · aggregating signature"
                        : ""
                  : ""}
              </div>
              <button
                onClick={runAction}
                disabled={running}
                className="inline-flex items-center rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-bone)] transition hover:opacity-90 disabled:opacity-40"
              >
                {running ? "Running ceremony…" : "Submit to vault →"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Custodian quorum — {selectedKey.label}
              </div>
              <div className="text-xs text-[var(--color-muted)]">
                Threshold {selectedKey.threshold}/{selectedKey.custodians.length}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {selectedKey.custodians.map((c) => {
                const s = custodianStates[c] || "idle";
                const badge =
                  s === "idle"
                    ? { label: "Idle", cls: "text-[var(--color-muted)] border border-[var(--color-line)]" }
                    : s === "waiting"
                      ? { label: "Awaiting share", cls: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" }
                      : s === "signed"
                        ? { label: "Partial signed", cls: "bg-[var(--color-accent)] text-[var(--color-bone)]" }
                        : { label: "Not in quorum", cls: "border border-[var(--color-line)] text-[var(--color-muted)]" };
                return (
                  <div
                    key={c}
                    className={`rounded-xl border p-4 transition ${
                      s === "waiting" || s === "signed"
                        ? "border-[var(--color-accent)]"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-sm font-semibold">
                          {c}
                        </div>
                        <div className="text-xs text-[var(--color-muted)]">
                          Operator node · holds 1 share
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div className="mt-3 border-t border-[var(--color-line)] pt-3 text-[11px] text-[var(--color-muted)]">
                      Share never leaves this node. Partial signature is the
                      only thing that does.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 transition ${
              result?.blockReason
                ? "border-[var(--color-warn)] bg-[var(--color-bone)]"
                : result?.signatureFragment
                  ? "border-[var(--color-ink)] bg-[var(--color-bone)]"
                  : "border-[var(--color-line)] bg-[var(--color-paper)]"
            }`}
          >
            <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Ceremony result
            </div>
            {result?.blockReason ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[var(--color-warn)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-bone)]">
                    Blocked pre-ceremony
                  </span>
                  <span className="text-sm font-semibold">
                    No signing cycles consumed
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                  {result.blockReason}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  Policy evaluation fires before a quorum can form. No
                  custodians were asked. No partial signatures exist. The
                  rejection is the only record.
                </p>
              </div>
            ) : result?.signatureFragment ? (
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Signature
                  </div>
                  <div className="tabnum mt-1 break-all font-mono text-xs text-[var(--color-ink)]">
                    {result.signatureFragment}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Quorum
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {result.participating.length} / {selectedKey.custodians.length}
                  </div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">
                    {result.participating.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Private key assembled
                  </div>
                  <div className="mt-1 text-sm font-semibold uppercase">
                    Never
                  </div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">
                    No party held the whole key at any point.
                  </div>
                </div>
                <p className="md:col-span-3 text-sm leading-relaxed text-[var(--color-ink)]">
                  Signature valid under the vault's public key and indistinguishable
                  on-chain from a single-party ECDSA/EdDSA signature. Audit
                  record written with quorum roster + policy evidence.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Submit an action to see the vault evaluate policy, collect
                quorum, and produce a signature — without ever reconstructing
                the key.
              </p>
            )}
          </div>
        </section>
      </div>
    </DemoChrome>
  );
}
