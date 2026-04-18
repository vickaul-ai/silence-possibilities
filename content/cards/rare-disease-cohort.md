---
title: Rare-Disease Cohort Studies Across Hospital Systems
industry: Healthcare
persona: Chief Research Officer, Academic Medical Center
summary: Three hospital systems jointly run a cohort study on a rare-disease population — without moving patient records across institutional boundaries, without a central biobank, and without a trusted third party stitching the data.
tier: concept
status_label: Concept · Pilot Partners Wanted
capability: Federated Cohort Analytics + Private Record Linkage + Differential Privacy
mpc_primitives: [PSI, Federated Learning, Differential Privacy, k-Anonymity Gate]
architecture_note: Each hospital runs a local node that holds its own EHR-derived cohort extract. Patient record linkage uses an OPRF-based PSI over a salted identifier (name, DOB, postcode hash) so duplicate patients across institutions are de-duplicated without any system seeing another system's identifiers. Cohort-level statistics (incidence, progression, response-to-therapy) are aggregated under threshold decryption with a differentially private noise budget per study.
before_state: A rare-disease cohort big enough to be scientifically useful usually requires 3–8 institutions to pool data. IRB review and data-use agreements take 9–18 months per institution. Most studies collapse under the weight of legal review before the science starts.
after_state: Patient records never leave their originating institution. Linkage happens in ciphertext; aggregates emerge with DP noise under a per-study privacy budget. A study that used to take 18 months of legal review becomes a signed query against a federation.
---

The mathematics of rare-disease research are unforgiving. A cohort of 200 patients with the same condition — enough to produce a publishable finding about progression or therapeutic response — usually does not exist inside any single hospital system. It exists across 3–8 of them. Pulling it together has historically meant either a central biobank (slow, expensive, frequently legally unworkable for international collaboration) or a patient-consent workflow that rules out most retrospective studies before they can begin.

A cryptographic federation changes the shape of the problem. Each participating hospital runs a local node on its own cohort extract. Record linkage across institutions is done via Private Set Intersection over salted identifiers — a patient who appears at two hospitals is de-duplicated without either system seeing the other's patient index. Cohort-level statistics — incidence, age of onset, time to event, response to a named therapy — are aggregated under threshold decryption, with a differentially private noise budget configured per study to cap re-identification risk.

The IRB and legal review load compresses because the data-use agreement is now about the federation's cryptographic guarantees rather than an inter-institutional data transfer. The scientific payoff is a cohort that was previously impossible to assemble.

This is a concept card. Silence has shipped the underlying primitives — Private Set Intersection, federated learning with differential privacy, threshold aggregation under a k-anonymity floor — in financial services consortium deployments. A healthcare pilot needs an academic medical center willing to stand up the first node and a second institution willing to link against it. Tell us which two hospital systems you want to link and we will sketch the node topology.
