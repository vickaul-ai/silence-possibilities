import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-bone)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-[var(--color-accent)]" />
          <div>
            <div className="text-sm font-semibold tracking-wide">
              Silence Possibilities
            </div>
            <div className="text-xs text-[var(--color-muted)]">
              What you could build with MPC
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-ink)]">
            Explore
          </Link>
          <a
            href="https://silencelaboratories.com"
            className="hover:text-[var(--color-ink)]"
          >
            Silence Labs
          </a>
          <a
            href="mailto:hello@silencelaboratories.com"
            className="rounded-full bg-[var(--color-ink)] px-4 py-1.5 text-xs font-medium text-[var(--color-bone)] hover:opacity-90"
          >
            Talk to us
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-bone)]">
      <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-[var(--color-muted)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            Every demo uses synthetic data. Prototypes illustrate what is
            possible with Silence Laboratories&apos; MPC stack — they are not
            live Silence services.
          </div>
          <div className="flex gap-4">
            <a
              href="https://silencelaboratories.com"
              className="hover:text-[var(--color-ink)]"
            >
              silencelaboratories.com
            </a>
            <a
              href="mailto:hello@silencelaboratories.com"
              className="hover:text-[var(--color-ink)]"
            >
              hello@silencelaboratories.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
