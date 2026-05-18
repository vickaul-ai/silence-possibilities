---
name: company-deep-dive
description: >-
  Deep-dive research and investment-style assessment of a company or startup,
  usually starting from a name or URL (YC profile, company site, Crunchbase,
  press). Use when the user wants to deeply understand a company and asks
  things like "help me understand what X does", "research this company",
  "explain this startup, assume I know nothing", "what's their moat", "who are
  the competitors", "what are the strengths and weaknesses", "where will they
  be in N years", or "what's your assessment". Produces a single structured
  briefing with a zero-knowledge plain-English explainer, a technology/product
  deep dive, founders, competitors, moat durability, strengths/weaknesses,
  forward scenarios, an opinionated verdict, and explicit confidence labeling.
---

# Company Deep Dive

Turn a company name or URL into a rigorous, opinionated briefing for someone
who starts with **zero knowledge** and wants enough depth to form a judgment.

## When to use

Trigger on requests to understand/assess a specific company or startup in
depth — especially when the user supplies a URL (YC, company homepage,
Crunchbase, a news article) and asks for what they do, the moat, competitors,
strengths/weaknesses, a forward outlook, or an overall assessment. Also fits
diligence prep, competitive teardowns, and "should I care about this company"
questions.

Do **not** use this for a quick one-line factual lookup ("when was X
founded") — answer that directly instead.

## Operating principles

1. **Primary source first.** Before delegating anything, fetch the canonical
   page the user gave you (or the company's own site) yourself. It anchors
   every downstream claim and prevents agents from hallucinating the basics.
2. **Parallelize the legwork.** Spawn independent research sub-agents for
   non-overlapping facets and run them concurrently. This protects the main
   context window and is much faster than serial searching. Use the two
   prompt templates in `references/subagent-prompts.md` (Stream A:
   product/technology/founders; Stream B: market/competitors/risks/funding).
   Add a third stream only if the company spans very distinct domains.
3. **Separate fact from inference, always.** Every non-obvious claim is
   tagged. Forward-looking statements are explicitly labeled speculation.
   Money/traction numbers from third-party aggregators are low-confidence by
   default — say so.
4. **Be opinionated, then show your work.** The user wants a judgment, not a
   Wikipedia dump. Give a clear verdict and probabilities, but expose the
   reasoning and the single biggest variable the outcome hinges on.
5. **Zero-knowledge layer is mandatory.** Open with a plain-English paragraph
   a smart non-expert understands, then go deep. If the company's edge is
   technical, explain the mechanism from first principles.

## Workflow

1. **Identify the target.** Extract the company name and the canonical URL
   from the user's message. Disambiguate if the name collides with a defunct
   or acquired namesake (note it explicitly in the report).
2. **Fetch the primary source yourself** (WebFetch on the YC/company page).
   Pull: one-liner, full description, product surfaces, tech, founders, batch,
   team size, location, funding status, named customers — verbatim where
   possible.
3. **Launch parallel research streams** using the templates in
   `references/subagent-prompts.md`. Feed each agent what you already learned
   from the primary source so it builds rather than re-derives. Tell agents
   to cite URLs and flag what they could not verify.
4. **Synthesize** strictly into the structure in
   `references/report-template.md`. Do not invent sections; do not skip the
   confidence note.
5. **Apply the quality bar** in `references/research-playbook.md` before
   sending: source hygiene, confidence rubric, scenario discipline, and the
   "is this actually opinionated" check.
6. **Offer a follow-up menu** (technical teardown, one-page investment memo,
   competitor-by-competitor matrix) — do not pre-write them.

## Output

A single chat message in the `report-template.md` shape. Dense but readable;
tables for competitors and scenarios. End with the confidence note and the
follow-up menu. Only write a file if the user explicitly asks for a document.

## Resources

- `references/report-template.md` — the exact section skeleton for the briefing.
- `references/subagent-prompts.md` — parameterized prompts for the parallel
  research streams.
- `references/research-playbook.md` — source-quality rules, the confidence
  rubric, scenario-probability discipline, and the final quality checklist.
