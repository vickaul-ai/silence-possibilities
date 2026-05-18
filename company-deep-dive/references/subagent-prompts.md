# Sub-agent Prompt Templates

Launch these as **parallel** general-purpose research agents in one message.
Before launching, paste in what the primary-source fetch already established
(one-liner, products, founders, batch) so agents build instead of re-deriving.
Substitute `{Company}`, `{URL}`, `{domain}`, and the `{known facts}` block.

Always instruct agents to: cite URLs, distinguish confirmed fact from
inference, report what they could **not** verify, and stay within a word
budget so the synthesis stays manageable.

---

## Stream A — Product, Technology & Founders

> I'm researching a company called **{Company}** ({URL}; site likely
> {domain}). Here is what the primary source already establishes — build on
> it, don't just repeat it:
>
> {known facts}
>
> Disambiguation: if the name collides with a different/defunct/acquired
> company, make the distinction explicit.
>
> Produce a detailed product + technology + founder briefing. Use web search
> and fetch their site, docs, blog, technical write-ups, YC/Crunchbase
> profile, LinkedIn, Hacker News, and press. Report, with URLs:
>
> 1. **What they actually do** — concrete products, who they're for, what a
>    customer literally gets, pricing, interfaces/SDKs, scope limits.
> 2. **How the technology works** — the real mechanism, explained from first
>    principles as if to a beginner, and *why it is hard*.
> 3. **What problem it solves** — why the status quo is unacceptable for the
>    target buyer.
> 4. **Founders** — names, backgrounds, prior companies/labs/education, why
>    (or whether) each is credible for this exact problem.
> 5. **Open-source / IP posture** — what's open, repos, verifiability claims.
> 6. **Customers, design partners, case studies, traction signals.**
> 7. **Batch / stage / any funding info.**
>
> ~600–900 words, structured. Separate confirmed fact from inference. List
> what you could not verify.

---

## Stream B — Market, Competitors, Moat & Risk

> I'm researching a company called **{Company}** ({URL}; site {domain}).
> Context already established from the primary source:
>
> {known facts}
>
> Produce a market, competitive, and risk briefing. Use web search and fetch
> relevant pages. Report, with URLs:
>
> 1. **Market context** — who needs this, the regulatory/economic forcing
>    functions, market-size signals (label analyst estimates as directional;
>    distinguish headline TAM from the realistic must-have segment).
> 2. **Competitors & adjacent players** — direct startups, incumbents /
>    hyperscalers / platforms, "good enough" substitutes, and any
>    architectural benchmark that isn't actually a competitor. For each: how
>    it differs from {Company}.
> 3. **Differentiation / moat** — what is and is *not* defensible; what stops
>    a large incumbent or open-source project from copying it; durability.
> 4. **Strengths & weaknesses** of {Company}'s position.
> 5. **Realistic risks** — commoditization, single-vendor/platform
>    dependency, performance/cost overhead, slow sales cycles, capital.
> 6. **Funding / traction signals** — flag third-party-aggregator numbers as
>    low-confidence.
>
> ~700–1000 words, structured. Separate fact from inference. List what you
> could not verify. End with a one-line bottom-line judgment.

---

## Optional Stream C — Domain-specific deep dive

Add only when the company spans a distinct domain the two streams won't cover
well (e.g. hard science, regulated clinical, hardware supply chain, a
specific developer ecosystem). Mirror the structure above, scoped to that
domain, and tell it explicitly not to overlap with A or B.
