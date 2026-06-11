"use client";

import Link from "next/link";

import { IconArrow } from "@/components/icons";
import { localizedLandingHref } from "@/lib/i18n/page-paths";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

const MESA_URL = "https://www.mesa-institute.org/";

export function MesaPageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.mesa;

  return (
    <div className="relative overflow-hidden pb-12">
      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.eyebrow}</p>
          <h1 className="mt-2 font-display text-[clamp(3rem,8vw,5.5rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.subtitle}</p>
          <span className="glass-chip mt-4 inline-block px-4 py-2 text-sm">{copy.tagline}</span>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={MESA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-primary"
            >
              <IconArrow className="h-4 w-4" />
              {copy.ctaVisit}
            </a>
            <Link href={localizedLandingHref(locale, "z-cop")} className="glass-button-secondary">
              {copy.ctaZCop}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.aboutTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">{copy.aboutBody}</p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          {copy.pillarsTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.pillars.map((pillar) => (
            <article key={pillar.name} className="glass-panel p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {pillar.role}
              </p>
              <h3 className="mt-3 font-display text-xl uppercase tracking-[0.04em]">{pillar.name}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.relationshipTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            {copy.relationshipBody}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 pb-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8">
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.partnerTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{copy.partnerDescription}</p>
          <Link href={localizedLandingHref(locale, "join")} className="glass-button-primary mt-6 inline-flex">
            {copy.partnerCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
