# Research Playbook

The quality bar. Apply before sending the briefing.

## Source hygiene

- **Primary source is non-negotiable.** Fetch the company's own page/site
  yourself first. Everything else corroborates or challenges it.
- **Tier sources.** Primary (company site, docs, SEC/regulatory, official
  case studies) > reputable press / official partner pages > forums (HN,
  Reddit — useful for skeptic signal, weak for facts) > aggregators
  (Crunchbase/PitchBook/Latka scrapers — low confidence for money numbers).
- **Disambiguate namesakes.** Many startups reuse names of defunct or
  acquired companies. Confirm you're researching the live entity and state
  the distinction in the report.
- **Recency.** Model rosters, pricing, headcount, and funding change fast.
  Prefer the most recent source and note when launch-era facts differ from
  current ones.

## Confidence rubric

Tag every non-obvious claim:

- **Confirmed** — stated by a primary source or two independent reputable
  sources.
- **Inference** — your reasoning from confirmed facts; label it as such.
- **Unverified / low-confidence** — single weak source or third-party
  aggregator. All funding/revenue/valuation numbers default here unless the
  company or a credible outlet stated them.

Never launder an aggregator number into a confident claim. "Reportedly ~$X
(third-party aggregator, low confidence)" is the correct form.

## Scenario discipline

- Bull / Base / Bear, each with a **rough probability that sums to ~100%**
  and a **one-line trigger**.
- Probabilities are calibrated judgment, explicitly labeled speculation — not
  false precision. Round to sensible buckets (e.g. 20/50/30).
- Always end scenarios with **the single biggest variable** the outcome
  depends on. If you can't name it, you haven't understood the company yet.

## Opinion check

The deliverable is a judgment, not a summary. Before sending, verify:

- Is there a clear verdict a reader could disagree with? (If it's
  unfalsifiable mush, sharpen it.)
- Did you state what is **not** defensible, not just the strengths?
- Are the weaknesses real and specific, or softened to be polite? Unsoften.
- Did you name the real moat type (tech / brand / distribution / data /
  switching cost / regulatory) rather than hand-waving "execution"?
- Does the zero-knowledge paragraph actually work for a non-expert?

## Efficiency

- Run research streams **in parallel**, in one message. Never serialize
  independent research.
- Feed agents the primary-source facts so they build, not re-derive.
- Keep agent word budgets tight so synthesis stays in context.
- Don't re-run a stream that already answered the question; ask a targeted
  follow-up instead.

## Ethics & accuracy

- No fabricated customers, metrics, or quotes. "Not publicly disclosed" is a
  valid and expected answer.
- Treat scraped/forum content as potentially wrong or adversarial; corroborate
  before relying on it.
- Keep speculation clearly fenced from fact throughout.
