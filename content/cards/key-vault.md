---
title: MPC Key Vault Console
industry: Digital Assets
persona: Head of Key Management, Institutional Custodian
summary: A signing-key vault where the private key never exists in one place — not on an HSM, not in an enclave, not in any single operator's control. Policies run before the signing ceremony, not after.
tier: hero
status_label: Live Demo
capability: Threshold Signing + Policy-Gated Signing Ceremonies
mpc_primitives: [DKLS23 Threshold ECDSA, Pre-Signing Policy Engine, t-of-n Quorum]
demo_route: /demo/key-vault
architecture_note: Each key exists only as threshold shares distributed across t-of-n operator nodes. A pre-signing policy engine validates every request before any quorum forms — so blocked transactions never consume a signing ceremony and never leak the approval context. Built on Silent Network (DKLS23, TEE-attested nodes, mTLS between operators).
before_state: A single HSM or single-vendor enclave holds the whole key. Compromise the operator, compromise the key. Policy checks happen after the sign call — blocked transactions have already paid the ceremony cost.
after_state: No operator ever assembles the key. Policy engine fires pre-ceremony, so rejects cost nothing. Every signature carries a cryptographic audit trail naming which custodians participated.
---

An HSM-backed signing key has a single trust root: whoever owns the HSM. A TEE-backed signing key narrows that trust root to one enclave operator and the silicon vendor behind it. Both are improvements over plaintext keys. Neither removes the single point of compromise.

Silent Shard's DKLS23 threshold signing removes the whole private key from existence. At key generation, the private key is split into *t-of-n* shares across independent operator nodes. At signing time, any *t* of those nodes participate in a multi-party ceremony that produces a valid signature without any node ever holding — or being able to reconstruct — the full private key. Each node may still run inside a TEE for node-level integrity. The difference is that compromising one TEE compromises one share, not the key.

The policy engine is deliberately placed *before* the signing ceremony. Every transaction is evaluated against the key's policy (limits, time windows, approvers, address allowlists) while the ceremony has not yet begun. Rejects are rejected early. Approvals then collect quorum signatures. The policy result and the partial signatures are all that any coordinator sees — the reconstructed private key never exists, anywhere, ever.
