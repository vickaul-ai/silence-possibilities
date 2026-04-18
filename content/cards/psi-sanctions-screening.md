---
title: Silent Sanctions Screening
industry: Compliance
persona: Head of AML, Payments PSP
summary: Screen customers against sanctions and PEP lists held by a third party — without revealing the customer list or the full sanctions list to either side.
tier: hero
status_label: Live Demo
capability: Private Set Intersection
mpc_primitives: [PSI, OPRF]
external_url: https://psi-good-ui.vercel.app
architecture_note: Customer list is hashed and blinded on the bank side. Sanctions list is held by the screening provider. PSI protocol returns only the matches — neither party reveals their full list to the other.
before_state: Banks upload customer lists to vendors, or vendors push full sanctions updates to banks. Both flows expose the raw list.
after_state: Intersection-only result. Cryptographic proof that no data beyond the matches was exchanged.
---

Sanctions screening is a legal requirement that produces an unwanted side-effect: either the bank shares its customer list with a screening vendor, or the vendor pushes the full sanctions list into the bank. Both flows leak something.

PSI lets two parties compute the intersection of their sets without revealing the sets themselves. The bank learns which of its customers matched. The vendor learns how many matched, but not who. The sanctions list and the customer list both stay at home.
