const memoText = `The short version
This document reads like a deal-celebration memo, not a terms analysis. It repeatedly frames an aggressive term (a 3X liquidation preference) as a "negotiation win" because it started at 4X. That's the wrong frame, and it's silent on exactly the three things you're asking about. None of your three questions are answered in the doc.
1. Is anyone getting a board seat?
The document says nothing about board seats, board observer rights, or any governance/control terms — not for Rami & Nick, not for the SAFE investors. That silence is the problem. Silence in a summary memo is not the same as "no board seat in the actual note." The economic terms here (3X pref, 12% interest, $8M cap, 15% discount) were clearly negotiated hard, and a lead writing a $500K check with a 3X preference is exactly the kind of investor who asks for a seat or at least an observer right.
So I can't confirm what you want confirmed from this document. You need to check the actual convertible note and side letter for Rami & Nick, specifically for: board seat, board observer rights, protective/veto provisions (consent rights over future financings, budget, hiring, sale of company), and information rights. For your governance context this matters a lot — your board today is Todd (CEO) + you (outside director), with Dan as non-voting observer. A lead investor seat would shift that balance materially.
Bottom line: the doc doesn't grant a seat, but it also doesn't prove no one's getting one. Verify against the note itself before you tell the board "no one is getting a board seat."
2. Most-favored-nation (MFN) clause
Again, the doc never mentions MFN — and this is a real exposure it should have flagged. Two angles:
The forward risk: standard YC SAFEs come in an "MFN" flavor. If Rich's or Manoj's SAFEs contain an MFN provision, and you later issue any convertible on better terms (better cap or discount), they can pull those better terms. With a $500K note sitting at an $8M cap vs. their $10M cap, an MFN SAFE would arguably let them ratchet to the $8M cap. Worth checking their actual SAFE versions.
The backward risk, which is bigger and the doc ignores entirely: you have $275K in prior SAFEs. If any of those prior SAFEs has an MFN clause, then issuing the new note/SAFEs on more favorable terms could trigger those prior investors' right to the improved terms. That's the classic "an investment we just made initiated an MFN" scenario you're worried about — and it lives in the prior paper, not the new round.
So the answer to "has any MFN been initiated by these investments?" is: the document can't tell you, because it doesn't address MFN at all. You have to read (a) the two new SAFEs and (b) all prior SAFEs for MFN language. This is a quick lawyer review and worth doing before close.
3. Convertible note scenarios — especially "what if we never raise an equity round?"
This is the most important gap. A convertible note is debt with a maturity date, and this doc treats it almost entirely as if it were equity-in-waiting. The table says 3-year term, 12% annual interest. That changes everything in your "never raise again" scenario.
Walk through what actually happens, by scenario:
Scenario A — You never raise a priced round, and you're operating (cash-flow positive, no exit). The SAFEs are fine — SAFEs never mature, so Rich and Manoj just sit there indefinitely until some trigger event. But the note matures (~mid-2029). At maturity, with no qualified financing to convert into, one of three things happens depending on what the actual note says: (a) principal + accrued interest becomes due and payable in cash — roughly $500K plus ~$180–200K of interest, call it ~$680–700K you'd owe Rami & Nick; (b) it auto-converts to equity at the $8M cap; or (c) the term gets extended by negotiation. The doc never states which. This is the term to nail down. If it's (a), and you're a profitable-but-not-flush company with no new capital coming in, you could be staring at a ~$700K cash obligation to two insiders, and a default if you can't pay. Your own capital plan ("we won't deploy until we're cash-flow positive… profitable Q4 2026, may not raise again") makes this scenario likely, not hypothetical — which is exactly why the omission is serious.
Scenario B — You get acquired without ever doing a priced round. Here the liquidation preference governs. Rami & Nick take their 3X (or 2X) off the top — or convert at the cap — whichever pays them more. SAFEs convert at their cap and share the rest. The doc covers a version of this but, see below, the math is incomplete.
Scenario C — You wind down / dissolve. Note holders are creditors — they get paid before any equity holder, ahead of SAFEs and ahead of you, and the 3X attaches. SAFEs return their purchase amount to the extent there's money. Common (you) is last.
The headline: in the "no future equity round" world, the convertible note is the thing that bites, because it's the only instrument with a clock on it. The doc's entire narrative ("once you hit $4M ARR, further investment becomes less critical") quietly assumes that not raising again is fine — but never reconciles that with the note's maturity. You should not let this close without knowing the maturity-default mechanics cold.
Things the doc gets wrong or buries (you didn't ask, but you need to hear it)
A 3X liquidation preference on a seed-stage angel convertible is way off-market, full stop. Standard seed terms are 1X non-participating. The doc spends three sections congratulating you for getting 4X down to 3X (→2X). Anchoring on 4X makes 3X feel like a win; measured against the actual market (1X), you're still at 2–3x the normal downside transfer to investors. That's the real story, and the memo inverts it.
Relatedly, the doc never says whether the preference is participating or non-participating. Its examples implicitly assume non-participating (investors take the pref or convert, not both). If the note is participating, every one of its exit examples understates what Rami & Nick take and overstates your $5.27M / $930K figures. Material unanswered term.
The exit math also ignores accrued interest. It uses a flat "$500K × 3 = $1.5M" preference. By the time of any exit, the note is principal plus 12% compounding interest, and the preference and conversion typically apply to that larger number. Every dollar figure for you in the doc is therefore slightly optimistic.
Finally, the "$10M acquisition → you get $5.27M at 62%" example treats your ownership as fixed at 62%, but conversion of the note and SAFEs dilutes you — the 62% is pre-conversion. Minor, but it's another place the doc rounds in your favor.

Net: don't take this memo to the board as-is. It's directionally upbeat on terms that are actually aggressive, and it's silent on all three of your questions. Before close I'd get a lawyer to read the actual Rami & Nick note (board/MFN/maturity-default/participating-vs-not) and every prior SAFE (MFN), then redo the memo around those facts. (Standard caveat: I'm not a lawyer — the executed note and SAFE documents govern, and these are exactly the clauses to have counsel confirm.)
Want me to turn this into a clean one-page redline/markup of the document, or a short list of questions to send your counsel?`;

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)]">
      <article className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <header className="mb-10 border-b border-[var(--color-line)] pb-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Private memo
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Delivr terms analysis
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
            Private terms note. Login required.
          </p>
        </header>
        <div className="whitespace-pre-wrap text-base leading-8 md:text-lg">
          {memoText}
        </div>
      </article>
    </main>
  );
}
