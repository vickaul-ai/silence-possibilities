import { Page } from "@/components/Shell";
import { CardGrid } from "@/components/CardGrid";
import { getAllCards } from "@/lib/cards";

export default function Home() {
  const cards = getAllCards();
  return (
    <Page>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-bone)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Silence Possibilities
            </div>
            <h1 className="mb-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              See what you could build when data never has to be reassembled.
            </h1>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              Multi-party computation changes what a joint workflow is allowed
              to look like. Every card below is a working picture of a product
              that would be impossible — or risky, slow, and politically
              stuck — without MPC. Open one. Play with it. Then tell us which
              one you want to pilot.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <CardGrid cards={cards} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Your industry not listed?
              </div>
              <div className="text-xl font-semibold">
                Tell us the workflow. We&apos;ll sketch the MPC version.
              </div>
            </div>
            <a
              href="mailto:hello@silencelaboratories.com?subject=Silence%20Possibilities%20—%20Use%20Case%20Idea"
              className="inline-flex items-center rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-bone)] hover:opacity-90"
            >
              Propose a use case →
            </a>
          </div>
        </div>
      </section>
    </Page>
  );
}
