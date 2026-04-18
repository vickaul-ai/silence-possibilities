---
title: Privacy-Safe Investor Analytics (Zult)
industry: Private Credit
persona: Accredited Investor / Fund Manager
summary: Ask plain-English questions about private credit fund composition, risk, and performance — with borrower identity never exposed.
tier: hero
status_label: Live Demo
capability: Confidential Compute VM with Policy Engine
mpc_primitives: [CCVM, Policy Engine, k-Anonymity Gate]
external_url: https://private-credit-mu.vercel.app
architecture_note: Investor question → LLM NLU → deterministic Policy Engine → simulated CCVM → LLM Composer → factual answer. Every response carries an expandable query trace showing what ran at each layer and confirming no raw borrower data exited the trust boundary.
before_state: Investor sees quarterly PDF reports. No ad-hoc questions. No ability to probe concentration or risk.
after_state: Conversational analytics over live fund data. Policy engine enforces entitlements and aggregation. Every answer is auditable.
---

Borrower data is among the most sensitive financial data a fund handles. Today, investors get static quarterly reports because letting them query the underlying loan book would expose too much. A cryptographic execution boundary changes that.

This prototype demonstrates a conversational analytics layer over two synthetic funds ($20M SMB equipment + $15M consumer auto), where the policy engine enforces whitelisting, entitlements, and k-anonymity before the compute runs. The investor gets the answer. The borrower data never leaves the vault.
