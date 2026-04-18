# Silence Possibilities — Agent Execution Brief

**Audience:** A Claude agent picking this project up to finish it.
**Your job:** Take the scaffold from "credible demo of a pattern" to "launch-ready site at `possibilities.silencelaboratories.com`."
**Owner / human in the loop:** Vic (consultant to Silence Laboratories). Ping him with Open Questions before making product calls he hasn't ratified.

Read this whole file before touching code. The human-facing `README.md` in this directory covers the mechanics (how to add a card, the frontmatter schema, local dev); this file covers the strategy, the current state, the backlog, and the gotchas a fresh agent will walk into.

---

## 1. What this project is and why it exists

Silence Laboratories sells a Multi-Party Computation (MPC) stack — Silent Shard (threshold signatures), Silent Compute (joint inference), Silent Auth, Silent Pay, Silent Inference. Their competitor framing fight is against Fortanix, which sells a TEE/enclave-based "Data Security Manager" narrative ("data never leaves the chip"). Silence's differentiated wedge is the *cross-organizational* use case — when two distrusting parties need to compute over their combined data without either one ever seeing the other's rows. TEEs are weaker there; MPC is the right tool.

`possibilities.silencelaboratories.com` is a card grid of industry-specific use cases. Each card clicks into one of three things:

- **Hero demo** — a working interactive prototype (e.g. the Consortium Fraud Console). These prove Silence can build the thing.
- **Storyboard** — a 4–6 frame clickable walkthrough with synthetic data. These explain workflows that aren't yet cheap to prototype.
- **Concept** — a description + architecture note + pilot CTA. These hold the space for workflows Silence wants pilot partners for, without the cost of building anything.

The point is NOT to be a product tour of what Silence ships. It is to expand a buyer's imagination of what becomes possible when they stop assuming data has to be centralized to be computed on. Marketing owns the narrative; product owns trace integrity and shipping-vs-concept honesty.

## 2. Success criteria — how you know you're done

Launch blocker checklist, in order:

1. **Data Clean Room hero demo** exists at `/demo/clean-room` and works. (See §6.)
2. **MPC Key Vault Console hero demo** exists at `/demo/key-vault` and works. (See §6.) This is the Fortanix-shaped one — it's the single most important card for the competitive positioning, don't skip it.
3. **Analytics instrumented.** PostHog or Plausible, per-card click events, per-demo drop-off events. Configurable via env var.
4. **External-link cards audited.** Zult and PSI prototypes currently link out. They must either (a) wear matching chrome (red banner, tier pill, Pilot CTA) or (b) get wrapped in an interstitial page on this site before the link-out. Inconsistent chrome across cards kills trust.
5. **All 6 existing cards pass honesty review.** No claim on any card exceeds what Silence can actually do today. Architecture notes match the underlying math. Flag anything that doesn't and bring it to Vic.
6. **`npm run build` succeeds** on the current stack pin (Next 14.2.15 + React 18.3.1 + Tailwind 3.4). Types clean, lint clean.
7. **Deployed to Vercel** with the Silence team invited to the project. CNAME instructions handed to their devops.

Stretch (if time): Trade Finance storyboard, Stablecoin CPN storyboard, 2 more concept cards (Healthcare cross-institution analytics, Dark pool matching). These are nice-to-have. 1 and 2 are not.

**Do not mark your task complete until you have run `npm run build` and watched it compile all pages without errors.** The sandbox may fight you on cleanup (see §11); verify in `/tmp` if needed.

## 3. Current state — exactly what's built as of handoff

Tree:

```
silence-possibilities/
├── content/cards/                  ← one markdown file per card, frontmatter-driven
│   ├── consortium-fraud.md         (hero, Financial Services)
│   ├── zult-investor-analytics.md  (hero, Private Credit — external link)
│   ├── psi-sanctions-screening.md  (hero, Compliance — external link)
│   ├── co-lending-underwriting.md  (storyboard, Lending)
│   ├── cross-border-msme.md        (storyboard, Cross-Border Finance)
│   └── a2a-agent-commerce.md       (concept, AI Agents)
├── src/
│   ├── app/
│   │   ├── page.tsx                ← landing (hero + CardGrid)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── concept/[slug]/page.tsx ← auto-renders all concept cards
│   │   ├── demo/consortium-fraud/  ← the one real hero demo
│   │   │   ├── page.tsx
│   │   │   └── ConsortiumFraudDemo.tsx
│   │   └── story/
│   │       ├── co-lending/
│   │       └── cross-border-msme/
│   ├── components/
│   │   ├── Shell.tsx               ← SiteHeader, SiteFooter, Page wrapper
│   │   ├── CardGrid.tsx            ← client component, industry + tier filters
│   │   ├── DemoChrome.tsx          ← shared frame: red banner, Demo/Arch/Trace tabs
│   │   └── Storyboard.tsx          ← shared storyboard component
│   └── lib/
│       └── cards.ts                ← getAllCards(), getCardBySlug(), getIndustries()
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── README.md                       ← human-facing
└── AGENT_BRIEF.md                  ← this file
```

Verified working:
- Build compiles clean on Next 14.2.15 + React 18.3.1 + Tailwind 3.4.
- All 6 routes prerender static; bundle sizes 94–98 kB first-load JS.
- `/demo/consortium-fraud` is fully interactive with animated MPC query flow, 4 banks, 3 sample queries, k-anonymity floor policy control.
- Storyboards navigate frame-by-frame with progress pips.
- Concept route renders dynamically from markdown.

Known gaps (this is your backlog, covered in §6):
- Only 1 of 3 Tier 1 cards is a real demo; the other 2 are external redirects.
- No analytics wiring.
- No Data Clean Room or Key Vault demos — these are the missing heroes.
- No 404 on the filtered-empty state of the grid (user picks a filter combo that matches zero cards — check what renders).

## 4. Strategic context you must internalize before making product decisions

**Why MPC vs TEE matters for the card selection.** When you evaluate whether a use case belongs on this site, ask: does this use case require two or more organizations that distrust each other to compute jointly? If yes, it's a fit. If the use case is about one organization protecting its own data from insider/infra compromise, Fortanix wins that framing and you should not fight them on it. Skip the card.

**Honesty is the product.** Every Tier 1 demo has a Query Trace tab that shows what actually crossed the trust boundary vs what stayed local. This is not decoration — it is the mechanism by which a buyer learns to trust MPC claims. If you add a hero demo, it MUST have a Query Trace. If you can't honestly draw one, the use case isn't ready to be a hero — make it a storyboard instead.

**Label everything.** Red banner on every demo. Tier pill on every card. No card may pretend to be a shipping product. If you find yourself softening this — "the banner is ugly, let me tone it down" — stop. The banner IS the positioning. It signals that Silence ships real things AND knows the difference between a demo and a deployment, which is a trust signal competitors can't easily copy.

**Content as code.** One markdown file in `content/cards/` = one card in the grid. Do not introduce a CMS. Do not introduce runtime content loading. The cards are built statically at deploy time. A dev who wants to add a card changes one file, opens one PR, and ships.

**Instrumentation is a launch blocker, not a nice-to-have.** Without per-card analytics there is no feedback loop. The monthly "which cards are pulling buyer engagement vs rotting" review that marketing and product should jointly own requires the data. Without it, every card gets defended on vibes a year from now.

## 5. Codebase conventions in use

- **Routing:** Next.js App Router. `src/app/demo/<slug>/page.tsx` for hero demos, `src/app/story/<slug>/page.tsx` for storyboards, `src/app/concept/[slug]/page.tsx` auto-handles concepts.
- **Card loader:** `src/lib/cards.ts` reads `content/cards/*.md` at build time via `gray-matter`. Slug = filename. See the Card type for the frontmatter schema; any new field should be added to the type and made optional unless you want every card to supply it.
- **Styling:** Tailwind 3 utility classes + CSS custom properties defined in `globals.css`. Use the custom properties (`var(--color-accent)`, `var(--color-bone)`, etc.) not hex codes — keeps theme-ability open.
- **Tabular numbers:** Use `className="tabnum"` for any monospaced-aligned numbers (loan amounts, dollar figures, hashes). Already in globals.css.
- **Icons:** No icon library. Emoji is fine for storyboard frames (see existing ones). Hero demos should not use emoji.
- **Client vs server:** Keep demo components as client components (`"use client"` at top). Keep the card loader, concept page, and shell as server components. Don't accidentally make the whole app client-side.
- **No `localStorage` anywhere.** If you need state that should persist across a session, use React state and accept it vanishes on reload. Artifact environment restrictions do not apply here (this deploys to Vercel, not an artifact), but local storage for a demo site invites weird cross-visit bugs.

## 6. The backlog — what to build next, with enough spec to act

### 6.1 PRIORITY 1: Data Clean Room hero demo (`/demo/clean-room`)

**What it is.** Two companies (say, Retailer A and Bank B) want to measure the overlap between their customer bases and joint spend patterns, without either handing over their customer list.

**Why it's hero material.** This is the canonical MPC-vs-TEE split. Fortanix can't tell this story because TEEs require one party to ingest the other's data into the enclave, which is exactly the trust fall the buyers won't make. MPC lets the computation happen without either list ever leaving its owner's node.

**What the demo should show.**
- Two panels side-by-side: "Retailer A" (left) and "Bank B" (right). Each shows a synthetic customer list preview, ~10 rows visible, with a counter showing "4.2M customers total."
- A center panel labeled "Overlap query." User picks from 3 canned questions: (a) "How many of my customers are also your customers?" (b) "Of those shared customers, what's their average card spend at merchants like me?" (c) "Which segment of shared customers has the highest LTV?"
- Hit Run. Animated OPRF + PSI + threshold aggregation flow in the middle column. Output appears as: "Intersection size: 1.24M customers (29.4% overlap). k-anonymity floor enforced at k=50 — segments below this threshold suppressed."
- Query Trace tab: lists what crossed the trust boundary (encrypted identifiers, the PSI ciphertexts, the final aggregate) and what did NOT (raw customer IDs, individual spend rows, segment memberships below k).
- Architecture tab: one-paragraph description + a simple diagram (inline SVG) showing Node A, Node B, no third party, OPRF-based PSI + threshold aggregation.

**Source material for the synthetic data and architecture note.** See `/Users/vic/Documents/Local-Vault/SL-Digital-Assets/` — there's a Data Clean Rooms whitepaper. Also check `/Users/vic/Documents/Projects/` for prior PSI prototypes (there's something named along the lines of `psi-good-ui` and the Zult project that both touch PSI).

**Done criteria.** Card appears in the grid as a Hero. Clicking it reaches `/demo/clean-room`. All three tabs (Demo, Architecture, Query trace) render. The Demo tab is interactive — user can pick a query and see the output animate. Query Trace tab is not blank.

### 6.2 PRIORITY 2: MPC Key Vault Console hero demo (`/demo/key-vault`)

**What it is.** A replacement for a Fortanix DSM-shaped "hardware security module in software" view, but powered by threshold signatures (Silent Shard / DKLS23) instead of an HSM.

**Why it's hero material.** This is the most direct competitive surface against Fortanix. If you only build one demo on this list, build this one.

**What the demo should show.**
- Keys panel: list of 4–6 synthetic keys ("prod-hot-wallet-eth", "treasury-usdc-cold", "signing-key-compliance", etc.) each with custodian split info ("3-of-5, custodians: ops, finance, risk, legal, audit").
- Policies panel: each key has policy rules (daily limit, time-of-day window, required approvers, address allowlist).
- Action panel: user attempts a signing operation ("Sign a $4M ETH transfer to 0x…"). Demo walks through threshold signing: collects approvals from the minimum quorum of custodians, validates the policy engine, shows the signature being produced WITHOUT any one node ever holding the full private key.
- Include a "reject" path: try a $40M transfer, watch policy block it before quorum forms. Shows that the policy engine is pre-signature, not post-.
- Query Trace: what each custodian saw (their share, the policy result, the partial signature), what the coordinator saw (partial signatures, final signature, policy evidence), what never existed anywhere (the reconstructed private key).

**Source material.** `/Users/vic/Documents/Local-Vault/09-Silent-Shard/Policy-Engine/` has competitor deep-dives (Fireblocks, BitGo, Anchorage, Copper, Fortanix DSM) and policy-engine architecture notes. Pull the specific Fortanix comparison — positioning against them should be crisp. Also `/Users/vic/Documents/Projects/policy-engine-prd/` if it exists.

**Done criteria.** Same as above — three tabs, Demo interactive, trace honest. Bonus: include a "Compare to HSM/TEE" callout in the Architecture tab that doesn't trash Fortanix by name but does make the distributed-trust argument plainly.

### 6.3 PRIORITY 3: Analytics instrumentation

- Add PostHog or Plausible. Vic will pick — ask him before installing. Default recommendation: Plausible if Silence wants lightweight cookie-free; PostHog if they want funnels and retention.
- Env var: `NEXT_PUBLIC_ANALYTICS_KEY`. Gracefully no-op if unset (so local dev isn't noisy).
- Events to fire:
  - `card_click` — { slug, tier, industry, destination_type: "internal" | "external" }
  - `demo_load` — { slug }
  - `demo_tab_switch` — { slug, tab }
  - `demo_action` — { slug, action } (e.g. query run, policy toggle)
  - `pilot_cta_click` — { slug, source: "demo" | "storyboard" | "concept" | "landing" }
- Add a one-paragraph note in README on how marketing reads the events.

### 6.4 PRIORITY 4: External-link card audit

Open `content/cards/zult-investor-analytics.md` and `content/cards/psi-sanctions-screening.md`. These link to live external prototypes. Before launch, either:
- **(Preferred)** Build an interstitial page (`/interstitial/[slug]`) that wears the shared chrome (red banner, Pilot CTA, etc.) and then CTAs out to the external prototype with a clear "This opens an existing Silence-built prototype" label. Card goes there first, then out.
- **(Acceptable)** Confirm with Vic that the external prototypes themselves wear consistent chrome. If yes, keep the direct link-out. If no, fix the external prototype or interstitial-wrap it.

### 6.5 Stretch backlog (only after 1–4 ship)

- **Trade Finance duplicate-invoice detection** (storyboard). 5 frames showing a factor and a bank both financing the same invoice, PSI catching the double-pledge at underwriting time. Synthetic data, not interactive.
- **Stablecoin screening for CPN** (storyboard). 4 frames: a cross-border payment network screens for sanctions / fraud without pooling all member banks' payment data into a central consortium ledger. MPC-native alternative to a shared ledger consortium.
- **Healthcare cross-institution analytics** (concept). 3 US hospital systems running joint cohort studies on rare-disease populations without moving PHI across institutional boundaries.
- **Dark pool matching** (concept). Order matching across venues without revealing order books — MPC-native dark pool primitive.
- **FMCG recipe IP protection** (concept). Co-manufacturing without revealing proprietary recipes — there's a Silence whitepaper on this already.
- **Silent Pay Agent Sandbox** (hero). Port from the `silent-pay-infer` project at `/Users/vic/Documents/Projects/silent-pay-infer/` — that one has a full PRD and OpenAPI spec. Likely 1–2 days of porting work.

## 7. How to add each tier (cheat sheet)

### Hero demo
1. Create `content/cards/<slug>.md` with `tier: hero`, `demo_route: /demo/<slug>`, and all the frontmatter fields (see `README.md` for schema).
2. Create `src/app/demo/<slug>/page.tsx` — server component, wraps the demo in `<Page>` and `<DemoChrome>`.
3. Create `src/app/demo/<slug>/<SlugDemo>.tsx` — client component (`"use client"`), the actual interactive thing.
4. Supply `architecture` and `trace` content to `<DemoChrome>` so the other two tabs aren't empty.
5. Run `npm run build` — confirm new route appears in the route table.

### Storyboard
1. Create `content/cards/<slug>.md` with `tier: storyboard`, `demo_route: /story/<slug>`.
2. Create `src/app/story/<slug>/page.tsx` and `src/app/story/<slug>/<SlugStory>.tsx`.
3. Define a `FRAMES: StoryFrame[]` array with 4–6 frames. Each frame has `title`, `body`, `screen` (a JSX block), optional `note` on the final frame.
4. Render via `<Storyboard frames={FRAMES} />`. No other work needed.

### Concept
1. Create `content/cards/<slug>.md` with `tier: concept`. No `demo_route` needed.
2. Fill in `before_state`, `after_state`, `architecture_note`, and the markdown body describing the workflow.
3. That's it. `/concept/[slug]` renders automatically.

## 8. Source research corpus — where the domain knowledge lives

Vic has done extensive research. Don't invent use-case framing; pull it from his vault.

- **Master index:** `/Users/vic/Documents/Local-Vault/SL-Digital-Assets/00-Use-Case-Index.md` — 19 verticals, ~175 files.
- **Silent Shard / Policy Engine:** `/Users/vic/Documents/Local-Vault/09-Silent-Shard/Policy-Engine/` — competitor deep-dives (Fireblocks, BitGo, Anchorage, Copper, Fortanix DSM).
- **Whitepapers:** `/Users/vic/Documents/Local-Vault/SL-Digital-Assets/03-Whitepapers/` — Financial Services, Data Clean Rooms, AI Agents, Web3, FMCG.
- **Existing prototypes you can mine for code/data/architecture:**
  - `/Users/vic/Documents/Projects/silent-pay-infer/` — PRD, FRD, OpenAPI, GTM, the richest one
  - `/Users/vic/Documents/Projects/private-credit/` — Zult.io source, CCVM-simulated
  - `/Users/vic/Documents/Projects/agentic-payments/` — markdown+frontmatter pattern, mature
  - `/Users/vic/Documents/Projects/policy-engine-prd/` — policy engine spec
  - `/Users/vic/Documents/Projects/intercreditor/` — joint credit workflows
  - `/Users/vic/Documents/Projects/sl-digital-assets/` — marketing/sales assets
  - `/Users/vic/Documents/Projects/SL/qapita/` — ESOP portal, Supabase, not directly relevant but shows Silence's style

**Before writing any new architecture_note or before_state/after_state copy, search the vault for the relevant vertical.** Vic will spot inconsistencies with the published whitepapers faster than he'll spot clever writing.

## 9. Build, deploy, stack pins

Stack:
- Next.js 14.2.15 (pinned — do NOT bump to 15 without testing, Next 15 rejects `next.config.ts` in some configs)
- React 18.3.1 (pinned — NOT React 19 RC)
- Tailwind 3.4 (pinned — NOT Tailwind 4 beta)
- TypeScript 5
- gray-matter 4.0.3

Commands:
```bash
npm install
npm run dev          # localhost:3000
npm run build        # must pass before merging
npm run start        # serve the production build locally
```

Deploy:
```bash
npx vercel           # link project first time
npx vercel --prod    # ship to production
```

Then CNAME `possibilities.silencelaboratories.com` at the Vercel deployment.

## 10. Design principles — tests to apply to every change you make

1. **Label everything.** No card, no demo, no storyboard may omit the red synthetic-data banner or the tier pill.
2. **Show the boundary.** Every Tier 1 demo has a Query Trace tab that explicitly says what crossed the trust boundary and what didn't.
3. **Content as code.** One markdown file = one card. No CMS. No runtime fetch.
4. **Instrument before launch.** If you add a demo, add its analytics events in the same PR.
5. **If it's not honest, it's not on the site.** If a demo would require claiming Silence can do something they can't yet, make it a storyboard. If a storyboard would require inventing mechanics that don't exist, make it a concept. Ratchet down until the claim is honest.

## 11. Sandbox/environment gotchas you will hit

If you're running this inside a sandboxed/bind-mounted environment (which is where I built it):

- `rm -rf node_modules` may fail with "Operation not permitted" on the bind mount. Workaround: `mv node_modules /tmp/old_node_modules` — rename works even when delete doesn't.
- `npm run build` may succeed on compilation but fail on the final cleanup step with `EPERM: operation not permitted, unlink '.next/export/404.html'`. This is a bind-mount artifact, not a code bug. To get a clean exit code, copy the project to `/tmp/spbuild` and build there:
  ```bash
  mkdir -p /tmp/spbuild
  cp -r src content package.json package-lock.json postcss.config.mjs tailwind.config.ts tsconfig.json next.config.mjs /tmp/spbuild/
  cd /tmp/spbuild && npm install && npm run build
  ```
- The `next.config.ts` file was renamed to `next.config.ts.bak` during the downgrade to Next 14. Leave it. `next.config.mjs` is the live config.

## 12. Honest assessment — what I'd push back on before you start

Vic has preferences: tell him what he needs to hear, not what he wants to hear. Apply the same standard to your own work.

- **The current 6 cards skew toward financial services.** That reflects Vic's research corpus but it's a marketing mistake to ship with 4/6 cards being FS. Before launch, push for at least 2 non-FS categories visibly featured (AI Agents, Healthcare, FMCG).
- **"External link" cards are a shortcut the site will pay for.** They break the chrome consistency, they can't be instrumented the same way, and they train the visitor that some cards are "real" and some aren't. Plan to retire them once internal replacements exist.
- **The storyboard format is storytelling-heavy.** It works for buyers who like narrative; it does not work for buyers who want to stress-test the mechanics. Push to upgrade the two existing storyboards to hero demos within 6 months post-launch, or swap in new storyboards for verticals that are harder to prototype.
- **There is no sales funnel tied to the site.** "Pilot this with us →" goes to `mailto:hello@silencelaboratories.com`. That's fine for a month. Then it needs to be a form that tags the inbound by card, by industry, by MPC primitive, and routes to the right AE in their CRM. Flag this before launch.
- **Vic has not confirmed that Silence's marketing and product teams want this site.** Verify before shipping. Do not push to prod until the Silence team is aligned on ownership — this is an editorial stream, not a one-off asset.

## 13. Open questions — bring these to Vic before acting

1. **Analytics vendor.** Plausible or PostHog? (Default rec: Plausible if privacy-first matters, PostHog if funnels matter.)
2. **Domain setup.** Who owns the CNAME at Silence? Has Vic or anyone at Silence provisioned the subdomain?
3. **External-link cards.** Are the Zult and PSI external prototypes stable and presentable? Should they be wrapped in interstitial pages, kept as direct links, or removed until they have matching chrome?
4. **Design review.** Has anyone at Silence (marketing, brand, exec) reviewed the color palette and chrome? The current palette (bone/ink/accent-green/warn-orange) is my pick, not theirs.
5. **Content ownership post-launch.** Who at Silence owns adding new cards? Marketing? Product? Both? The README recommends a joint editorial stream; confirm.
6. **Which existing prototype should become Silent Pay Agent Sandbox?** `silent-pay-infer` has the richest spec — is it ready to be adapted, or does it need its own scoping pass first?

## 14. Verification checklist for your own work

Before you hand this back to Vic and claim anything is done:

- [ ] `npm run build` exits 0 (verify in `/tmp` if the bind mount is fighting you)
- [ ] Every new hero demo has all three tabs populated (Demo, Architecture, Query trace)
- [ ] Every new card has a red synthetic-data banner on its destination page
- [ ] Every new card has a Pilot CTA pointing to `mailto:hello@silencelaboratories.com?subject=Pilot%20interest%20—%20<TITLE>` or, once a form exists, to the form
- [ ] Analytics events fire in the browser console on a local dev run
- [ ] The card appears in the grid at `/` with correct tier pill and industry filter
- [ ] No `localStorage`, no runtime content loading, no CMS
- [ ] Types clean (`npm run build` would have caught this, but worth sanity-checking)
- [ ] You ran Vic's own critique test: would he sign off on this, or would he push back on the claim being unsupported? If you'd push back in his shoes, don't ship it.

---

**Handoff note.** The scaffold I left is good but not sufficient. The single biggest risk to this launch is shipping with only one real hero demo and three external redirects — it undersells Silence's technical depth. Prioritize building the Data Clean Room and MPC Key Vault demos before anything else on this list. Everything else is negotiable; those two are not.

Good luck.
