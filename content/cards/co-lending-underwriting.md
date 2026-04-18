---
title: Co-Lending Joint Underwriting
industry: Lending
persona: Chief Risk Officer, NBFC and Partner Bank
summary: Two lenders jointly underwrite a borrower — applying both credit policies, deduplicating exposure, and booking the split loan — without sharing applicant files.
tier: storyboard
status_label: Walkthrough
capability: Multi-Party Computation over structured credit data
mpc_primitives: [MPC, Threshold Attestation, Audit Log]
demo_route: /story/co-lending
architecture_note: NBFC and bank each hold their view of the applicant. MPC evaluates both credit policies, deduplicates across lenders, and returns a joint decision. Each side books only their share; the other side's data never materialises on the partner's systems.
before_state: CLM-1 / CLM-2 workflows require manual sharing of applicant files between NBFC and bank. Reconciliation breaks. Exposure deduplication is retroactive.
after_state: Joint underwriting in one pass. Exposure dedup at decision time, not at month-end.
---

India's co-lending model pairs NBFCs (who find the borrower) with banks (who fund most of the loan). The operational pain is that both parties need to see the applicant, apply their credit policy, and avoid double-lending to the same person across their combined book — all without building a shared data lake that regulators would not approve.

This walkthrough shows a joint underwriting flow: one applicant, two lenders, one MPC-backed decision, two separate books.
