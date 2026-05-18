# company-deep-dive (Claude skill)

Turns a company name or URL into a rigorous, opinionated briefing for someone
starting from zero knowledge: plain-English explainer, product/tech deep dive,
founders, competitors, moat durability, strengths/weaknesses, 3-year
scenarios, an opinionated verdict, and explicit confidence labeling.

It encodes a repeatable method: fetch the primary source yourself, fan out
**parallel** research sub-agents for non-overlapping facets, then synthesize
into a fixed structure with fact-vs-inference tagging.

## Contents

```
company-deep-dive/
├── SKILL.md                          # loaded into context when the skill runs
├── README.md                         # this file (human install notes)
└── references/
    ├── report-template.md            # exact output skeleton
    ├── subagent-prompts.md           # parallel research-stream prompts
    └── research-playbook.md          # source rules, confidence rubric, QA bar
```

## Install

Pick one:

- **Personal (all your projects):** copy the `company-deep-dive/` folder into
  `~/.claude/skills/`
- **Project (shared via repo):** copy it into `.claude/skills/` in the repo
- **Plugin:** include the folder in a plugin's `skills/` directory

Then start (or restart) Claude Code. Invoke explicitly with
`/company-deep-dive`, or just ask naturally ("research this company, assume I
know nothing: <url>") — the description is written to auto-trigger.

## Usage

```
/company-deep-dive https://www.ycombinator.com/companies/<name>
```

or

> Help me understand this company in depth — assume I know nothing. What's
> their moat, who are the competitors, strengths/weaknesses, and where will
> they be in 3 years? <url>

## Notes

- Best results when you give it a canonical URL (YC profile, company site).
- Funding/revenue numbers from third-party aggregators are deliberately
  labeled low-confidence — the skill will not present them as fact.
- Output is a single chat briefing by default; ask explicitly if you want it
  written to a file or turned into an investment memo.
