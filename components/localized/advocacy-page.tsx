"use client";

import { useDictionary } from "@/lib/i18n/context";

export function AdvocacyPageContent() {
  const dictionary = useDictionary();
  const copy = dictionary.advocacy!;

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,70,13,0.07),transparent_30%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-8 sm:px-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.packagesTitle}</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {copy.advocacies.map((item) => (
            <li key={item} className="glass-panel p-6">
              <h2 className="font-display text-xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {item}
              </h2>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <a href="#" className="glass-button-primary inline-flex">
            {copy.toolkitCta}
          </a>
          <p className="mt-2 text-xs text-[var(--text-faint)]">{copy.toolkitNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="max-w-2xl text-sm leading-8 text-[var(--text-muted)]">{copy.requestDescription}</p>
          <div className="mt-4">
            <a
              href="mailto:info@theglobalcall.org"
              className="glass-button-primary inline-flex"
            >
              {copy.requestCta}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
