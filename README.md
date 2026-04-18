# Silence Possibilities

Interactive previews of what you can build with Silence Laboratories' MPC stack. A card grid of industry-specific use cases; each card opens either a live interactive demo, a clickable walkthrough, or a concept page.

**Live preview:** https://silence-possibilities.vercel.app
**Intended launch URL:** `possibilities.silencelaboratories.com` (CNAME to the Vercel deployment above).
**GitHub:** https://github.com/vickaul-ai/silence-possibilities

## What this is, concretely

Three tiers of cards, all rendered from markdown in `content/cards/`:

- **Hero demos** (`tier: hero`) — fully interactive apps. Route lives at `demo_route` (e.g. `/demo/key-vault`). External-link heroes (legacy Silence prototypes hosted elsewhere) route through `/interstitial/[slug]` first so they wear matching chrome before linking out.
- **Storyboards** (`tier: storyboard`) — four-to-six-frame clickable walkthroughs. Route at `demo_route`, e.g. `/story/co-lending`.
- **Concepts** (`tier: concept`) — description + architecture note + pilot CTA. Renders automatically at `/concept/[slug]`.

Every Tier 1 and Tier 2 page wears the same shared chrome: red "synthetic data" banner, three-tab layout (Demo / Architecture / Query trace), "Pilot this with us" CTA. That chrome enforces honesty and teaches the MPC mental model.

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
external_url: https://...        # (optional — cards with this route through /interstitial/[slug])
demo_route: /demo/... or /story/...   # (hero or storyboard)
architecture_note: One paragraph.
before_state: One sentence on how the world works today.
after_state: One sentence on how the world works with Silence.
---

Free-form markdown body goes here. Used on concept and interstitial pages.
```

## Analytics

Plausible is wired but gated on an env var so local dev stays quiet. To enable:

```bash
# .env.local
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=possibilities.silencelaboratories.com
NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io   # optional; defaults to plausible.io
```

Events emitted:

| Event | Props | When |
|---|---|---|
| `card_click` | `slug, tier, industry, destination_type` | A card in the grid is clicked |
| `demo_load` | `slug` | A hero demo page mounts |
| `demo_tab_switch` | `slug, tab` | User switches Demo / Architecture / Query trace |
| `demo_action` | `slug, action, ...` | User runs a query, submits an action, etc. |
| `pilot_cta_click` | `slug, source` | "Pilot this with us" mailto is clicked |
| `external_prototype_open` | `slug, industry` | User opens an external prototype from the interstitial |

How marketing reads the events: every card should generate `card_click` at a baseline rate that reflects grid visibility; the interesting ratios are `card_click → demo_load`, `demo_load → demo_action`, and `demo_load → pilot_cta_click`. A card that pulls clicks but never pulls pilot CTAs is a discovery/qualification problem; a card that pulls neither is a positioning problem; a card that pulls CTAs at a healthy rate is a promotion candidate.

Switch to PostHog by replacing `src/components/Analytics.tsx` and `src/lib/analytics.ts` — the event names and prop shapes are already in a vendor-neutral `trackEvent()` API.

## Deploying

The project is linked to Vercel and to GitHub. Pushing to `main` triggers an auto-deploy.

Manual commands:

```bash
npx vercel          # link / preview deploy
npx vercel --prod   # promote to the Vercel production domain (NOT the silencelaboratories.com CNAME — that is a separate step)
```

To attach the custom domain:
1. In the Vercel project settings, add `possibilities.silencelaboratories.com` as a domain.
2. Ask Silence devops to add a CNAME record: `possibilities` → `cname.vercel-dns.com`.
3. Vercel will issue an SSL cert automatically.

Build verified on Next 14.2.15 + React 18.3.1 + Tailwind 3.4. Do not bump to Next 15 or React 19 without a re-verification pass.

## Current card roster

| Tier | Industry | Title | Route |
|---|---|---|---|
| Hero | Digital Assets | MPC Key Vault Console | `/demo/key-vault` |
| Hero | Data Collaboration | Data Clean Room | `/demo/clean-room` |
| Hero | Financial Services | Consortium Fraud Console | `/demo/consortium-fraud` |
| Hero | Private Credit | Privacy-Safe Investor Analytics (Zult) | `/interstitial/zult-investor-analytics` → external |
| Hero | Compliance | Silent Sanctions Screening | `/interstitial/psi-sanctions-screening` → external |
| Storyboard | Lending | Co-Lending Joint Underwriting | `/story/co-lending` |
| Storyboard | Cross-Border Finance | Cross-Border MSME Credit Inference | `/story/cross-border-msme` |
| Concept | Healthcare | Rare-Disease Cohort Studies Across Hospital Systems | `/concept/rare-disease-cohort` |
| Concept | AI Agents | Confidential Agent-to-Agent Commerce | `/concept/a2a-agent-commerce` |

## Backlog — what to add next

- Silent Pay Agent Sandbox (hero — port from `silent-pay-infer`)
- Trade Finance duplicate-invoice detection (storyboard)
- Stablecoin screening for CPN (storyboard)
- Dark pool matching (concept)
- FMCG recipe IP protection (concept — whitepaper already exists in the vault)

## Design principles baked into the shell

1. **Label everything.** Red banner on every demo. Tier pill on every card. No demo pretends to be a shipping product.
2. **Show the boundary.** Every Tier 1 demo has a Query Trace that explicitly shows what crossed the trust boundary and what didn't.
3. **Content as code.** One markdown file = one card. No CMS. No dev ticket to add.
4. **Instrument before launching.** Analytics events are wired at the same time as the card. Monthly cadence review reads the funnel.
5. **If it's not honest, it's not on the site.** Ratchet down the tier until the claim is honest. A concept card that's accurate beats a hero demo that overclaims.

## Hosting the program

Operate this as a standing editorial stream jointly owned by marketing (narrative, launch, social tie-ins) and product (architecture accuracy, trace integrity, shipping-vs-concept status). Weekly cadence. Monthly audit on which cards are pulling buyer engagement vs. rotting.
