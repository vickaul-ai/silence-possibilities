import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "@/components/Shell";
import { getAllCards, getCardBySlug } from "@/lib/cards";

export async function generateStaticParams() {
  return getAllCards()
    .filter((c) => c.tier === "concept")
    .map((c) => ({ slug: c.slug }));
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  return (
    <Page>
      <div className="bg-[var(--color-warn)] text-[var(--color-bone)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[11px] uppercase tracking-wider">
          <span>Concept — not yet prototyped</span>
          <Link href="/" className="underline">
            Back to Possibilities
          </Link>
        </div>
      </div>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-bone)]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            {card.industry} · {card.persona}
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            {card.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--color-muted)]">
            {card.summary}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                The workflow
              </div>
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {card.content.trim()}
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Before
              </div>
              <p className="text-base leading-relaxed">{card.before_state}</p>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                After — with MPC
              </div>
              <p className="text-base leading-relaxed">{card.after_state}</p>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Architecture note
              </div>
              <p className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5 text-sm leading-relaxed text-[var(--color-muted)]">
                {card.architecture_note}
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
              <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Capability
              </div>
              <div className="text-sm font-semibold">{card.capability}</div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.mpc_primitives.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-[var(--color-line)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--color-ink)] p-5 text-[var(--color-bone)]">
              <div className="mb-2 text-xs uppercase tracking-wider opacity-70">
                Interested?
              </div>
              <p className="mb-4 text-sm leading-relaxed opacity-90">
                If this maps to a workflow you own, we&apos;ll co-design a
                pilot with you. Silence ships the MPC primitives and the
                policy engine; you bring the data governance and the first
                users.
              </p>
              <a
                href={`mailto:hello@silencelaboratories.com?subject=Pilot%20interest%20—%20${encodeURIComponent(card.title)}`}
                className="inline-flex items-center rounded-full bg-[var(--color-bone)] px-4 py-2 text-xs font-medium text-[var(--color-ink)] hover:opacity-90"
              >
                Pilot this with us →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </Page>
  );
}
