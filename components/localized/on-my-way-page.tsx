"use client";

import Link from "next/link";

import { IconArrow } from "@/components/icons";
import { localizedLandingHref } from "@/lib/i18n/page-paths";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";
import { SANDBOX_CONTACT } from "@/lib/sandbox/content";

export function OnMyWayPageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.onMyWay;

  return (
    <div className="relative overflow-hidden pb-12">
      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.eyebrow}</p>
          <h1 className="mt-2 font-display text-[clamp(3rem,8vw,5.5rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.subtitle}</p>
          <span className="glass-chip mt-4 inline-block px-4 py-2 text-sm">{copy.dates}</span>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary">
              <IconArrow className="h-4 w-4" />
              {copy.ctaEmail}
            </a>
            <Link href={localizedLandingHref(locale, "z-cop")} className="glass-button-secondary">
              {copy.ctaZCop}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          {copy.pipelineTitle}
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {copy.pipeline.map((platform) => (
            <article key={platform.name} className="glass-panel p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {platform.role}
              </p>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.04em]">{platform.name}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{platform.description}</p>
            </article>
          ))}
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
