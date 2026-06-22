import type { Metadata } from "next";
import Link from "next/link";

import { Reveal, RevealStagger, StaggerItem } from "@/components/motion-primitives";
import { SANDBOX_LANDINGS } from "@/lib/sandbox/content";

export const metadata: Metadata = {
  title: "Sandbox Index",
  description: "Prototype landing pages built from context documents.",
  robots: { index: false, follow: false },
};

export default function SandboxIndexPage() {
  return (
    <main className="mx-auto max-w-7xl px-3 py-10 sm:px-5 lg:px-8 lg:py-16">
      <Reveal className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
          Prototype landings
        </p>
        <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.9] tracking-[0.05em] text-[var(--text-primary)]">
          Sandbox
        </h1>
        <p className="text-base leading-8 text-[var(--text-muted)] sm:text-lg">
          Draft marketing surfaces generated from the context folder — On My Way concept note,
          Z-COP presentation deck, and implementation guide. For review only.
        </p>
      </Reveal>

      <RevealStagger className="mt-10 grid gap-5 lg:grid-cols-2" stagger={0.08}>
        {SANDBOX_LANDINGS.map((landing) => (
          <StaggerItem key={landing.slug}>
            <Link
              href={`/sandbox/${landing.slug}`}
              className="glass-panel-strong group block h-full p-6 transition hover:-translate-y-1 sm:p-8"
            >
              <p
                className="text-xs uppercase tracking-[0.22em]"
                style={{ color: landing.accent }}
              >
                {landing.dates}
              </p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)] transition group-hover:translate-x-1">
                {landing.title}
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--text-faint)]">
                {landing.subtitle}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                {landing.description}
              </p>
              <span
                className="mt-6 inline-block text-sm font-medium"
                style={{ color: landing.accent }}
              >
                Open landing →
              </span>
            </Link>
          </StaggerItem>
        ))}
      </RevealStagger>
    </main>
  );
}
