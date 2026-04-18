# Silence Possibilities

Interactive previews of what you can build with Silence Laboratories' MPC stack. A card grid of industry-specific use cases; each card opens either a live interactive demo, a clickable walkthrough, or a concept page.

**Intended deploy target:** `possibilities.silencelaboratories.com` (Vercel).

## What this is, concretely

Three tiers of cards, all rendered from markdown in `content/cards/`:

- **Hero demos** (`tier: hero`) — fully interactive apps. Route lives at `demo_route` (internal, e.g. `/demo/consortium-fraud`) or `external_url` (already-deployed prototypes like Zult.io).
- **Storyboards** (`tier: storyboard`) — five-to-ten-frame clickable walkthroughs. Route lives at `demo_route`, e.g. `/story/co-lending`.
- **Concepts** (`tier: concept`) — description + architecture note + pilot CTA. Renders automatically at `/concept/[slug]`.

Every Tier 1 and Tier 2 page wears the same shared chrome: red "synthetic data" banner, three-tab layout (Demo / Architecture / Query trace), "Pilot this" CTA. That chrome enforces honesty and teaches the MPC mental model.

## Local dev

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

## Adding a new card

1. Create `content/cards/<slug>.md` with the frontmatter below.
2. For a Hero or Storyboard, also create the page component at `src/app/demo/<slug>/` or `src/app/story/<slug>/`.
3. Concepts require no extra work — the `[slug]` route renders them automatically.

### Frontmatter schema

```yaml
---
title: Human-readable title
industry: Financial Services | Lending | Compliance | AI Agents | ...
persona: Primary buyer / user
summary: One-line pitch, max ~200 chars
tier: hero | storyboard | concept
status_label: Live Demo | Walkthrough | Concept
capability: One-line MPC capability name
mpc_primitives: [PSI, TSS, CCVM, ...]
external_url: https://...        # (hero only, optional — links out)
demo_route: /demo/... or /story/...   # (hero or storyboard, optional)
architecture_note: One paragraph.
before_state: One sentence on how the world works today.
after_state: One sentence on how the world works with Silence.
---

Free-form markdown body goes here. Used on concept pages.
```

## Deploying to Vercel

```bash
npx vercel          # first time — link the project
npx vercel --prod   # ship
```

Point `possibilities.silencelaboratories.com` at the Vercel deployment via CNAME.

Build verified locally on Next 14.2.15 + React 18.3.1 + Tailwind 3.4. If you upgrade to Next 15 / React 19, rename `next.config.mjs` to `next.config.ts` and re-verify.

## Current card roster

| Tier | Industry | Title | Route |
|---|---|---|---|
| Hero | Financial Services | Consortium Fraud Console | `/demo/consortium-fraud` |
| Hero | Private Credit | Privacy-Safe Investor Analytics (Zult) | external |
| Hero | Compliance | Silent Sanctions Screening | external |
| Storyboard | Lending | Co-Lending Joint Underwriting | `/story/co-lending` |
| Storyboard | Cross-Border Finance | Cross-Border MSME Credit Inference | `/story/cross-border-msme` |
| Concept | AI Agents | Confidential Agent-to-Agent Commerce | `/concept/a2a-agent-commerce` |

## What to add next (backlog)

- Privacy-Preserving Data Clean Room (hero; port from PSI demo)
- MPC Key Vault Console (hero; the Fortanix DSM-shaped one)
- Silent Pay Agent Sandbox (hero; port from silent-pay-infer)
- Trade Finance duplicate-invoice detection (storyboard)
- Stablecoin screening for CPN (storyboard)
- Healthcare cross-institution analytics (concept)
- Dark pool matching (concept)
- FMCG recipe IP protection (concept)

## Design principles baked into the shell

1. **Label everything.** Red banner on every demo. Tier pill on every card. No demo pretends to be a shipping product.
2. **Show the boundary.** Every Tier 1 demo must have a Query Trace that explicitly shows what crossed the trust boundary and what didn't.
3. **Content as code.** One markdown file = one card. No CMS. No dev ticket to add.
4. **Instrument before launching.** Add per-demo analytics (PostHog or Plausible) before going live. Kill unused demos.

## Hosting the program

Recommend operating this as a standing editorial stream owned jointly by marketing (narrative, launch, social tie-ins) and product (architecture accuracy, trace integrity, shipping-vs-concept status). Weekly cadence. Monthly audit on which cards are pulling buyer engagement vs. rotting.
