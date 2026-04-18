---
title: Data Clean Room
industry: Data Collaboration
persona: Chief Data Officer, Retail Bank or Consumer Brand
summary: Two companies measure the overlap and joint behavior of their customer bases without either one handing over its customer list. The intersection is computed where the data lives — the lists never move.
tier: hero
status_label: Live Demo
capability: Private Set Intersection + Threshold Aggregation + k-Anonymity Gate
mpc_primitives: [OPRF, PSI, Threshold Aggregation, k-Anonymity Gate]
demo_route: /demo/clean-room
architecture_note: Each party's customer list is blinded with an Oblivious PRF and exchanged as pseudonyms. The intersection is computed over blinded identifiers; only aggregate counts and segment aggregates cross the trust boundary. Segments below the k-anonymity floor are suppressed.
before_state: Clean-room deals stall for months in legal while counsel debates whether hashing or a trusted third party is enough. The analytics that result — when they result — are one-shot, expensive, and buried in NDA.
after_state: Each party's raw list stays on its own node. Intersections and joint aggregates run in seconds under a k-anonymity floor. The counterparty sees the answer. It never sees the rows.
---

Every retailer and every bank has the same unanswered question: who are our shared customers, and what do they do with the other side? Until now the answer involved moving customer data into a trusted third party's enclave — Snowflake, AWS Clean Rooms, a TEE operator — and hoping the contract held. That transfer is exactly the trust fall most compliance and privacy teams will not make twice.

Private Set Intersection lets both sides compute the answer without ever moving their lists. Each party blinds its identifiers with an Oblivious PRF so no row ever leaves in a recognizable form. The blinded tokens are exchanged; the intersection is computed in ciphertext. For joint aggregates — average spend, LTV by segment — a threshold aggregation produces the number and a k-anonymity gate suppresses any segment too small to be private.

The distinction from a TEE-based clean room is that the intersection protocol is a property of the math, not of any single operator's attestation. There is no Snowflake to trust, no enclave to re-audit. Two parties, each running their own node. The answer leaves. The rows stay.
