---
title: Cross-Border MSME Credit Inference
industry: Cross-Border Finance
persona: SME Finance Head, Regional Bank
summary: Assess creditworthiness of a Singapore MSME applying for a loan from an Indian bank — using Singapore-side data that never leaves Singapore.
tier: storyboard
status_label: Walkthrough
capability: Cross-Border MPC Inference Exchange
mpc_primitives: [MPC, Federated Scoring, Jurisdiction-Aware Policy]
demo_route: /story/cross-border-msme
architecture_note: Applicant data stays in source jurisdiction. A scoring function is MPC-evaluated across source-jurisdiction data and requesting-bank policy. Only the inference (score + reason codes) crosses the border.
before_state: Cross-border MSME lending stalls on data residency. Either the data crosses the border (regulatory headache) or the loan doesn't happen.
after_state: Data stays home. Inference crosses. Loan happens.
---

The Finternet / Proxtera thesis: cross-border MSME credit is blocked not by willingness to lend but by data residency rules. If the applicant's data lives in Singapore and the lender lives in India, the data cannot legally travel — so the loan doesn't either.

MPC turns this from a data-transfer problem into an inference-transfer problem. The lender's question runs against the source data in place, and only the answer crosses the border.
