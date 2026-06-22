import Link from "next/link";

export function SandboxBanner() {
  return (
    <div className="border-b border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/10 px-3 py-2.5 sm:px-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <p className="text-[var(--text-primary)]">
          <span className="font-semibold uppercase tracking-[0.16em] text-[var(--brand-orange)]">
            Sandbox
          </span>
          <span className="mx-2 text-[var(--text-faint)]">·</span>
          <span className="text-[var(--text-muted)]">
            Prototype landing — not indexed for production
          </span>
        </p>
        <Link
          href="/sandbox"
          className="font-medium text-[var(--brand-blue)] underline-offset-4 hover:underline"
        >
          All sandbox landings
        </Link>
      </div>
    </div>
  );
}
