import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "@/components/Shell";
import { TrackedLink } from "@/components/TrackedLink";
import { getAllCards, getCardBySlug } from "@/lib/cards";

export async function generateStaticParams() {
  return getAllCards()
    .filter((c) => c.external_url)
    .map((c) => ({ slug: c.slug }));
}

export default async function InterstitialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card || !card.external_url) notFound();

  const pilotHref = `mailto:hello@silencelaboratories.com?subject=${encodeURIComponent(
    "Pilot interest — " + card.title,
  )}`;

  return (
    <Page>
      <div className="bg-[var(--color-warn)] text-[var(--color-bone)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[11px] uppercase tracking-wider">
          <span>Prototype — synthetic data — not a live Silence service</span>
          <Link href="/" className="underline">
            Back to Possibilities
          </Link>
        </div>
      </div>

      <section className="border-b border-[var(--color-line)] bg-[var(--color-bone)]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
            {card.industry} · {card.persona}
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            {card.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--color-muted)]">
            {card.summary}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                What this prototype shows
              </div>
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {card.content.trim()}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  Before
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {card.before_state}
                </p>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  After — with MPC
                </div>
                <p className="text-sm leading-relaxed">{card.after_state}</p>
              </div>
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
                Open the prototype
              </div>
              <p className="mb-4 text-sm leading-relaxed opacity-90">
                This opens an existing Silence-built prototype hosted at the
                address below. It runs on synthetic data and is not a live
                Silence service.
              </p>
              <TrackedLink
                href={card.external_url}
                event="external_prototype_open"
                props={{ slug: card.slug, industry: card.industry }}
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-bone)] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] hover:opacity-90"
              >
                Open prototype ↗
              </TrackedLink>
              <div className="break-all text-[10px] font-mono opacity-70">
                {card.external_url}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-5">
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Interested in piloting this?
              </div>
              <TrackedLink
                href={pilotHref}
                event="pilot_cta_click"
                props={{ slug: card.slug, source: "interstitial" }}
                className="inline-flex items-center rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs font-medium text-[var(--color-bone)] hover:opacity-90"
              >
                Pilot this with us →
              </TrackedLink>
            </div>
          </aside>
        </div>
      </section>
    </Page>
  );
}
