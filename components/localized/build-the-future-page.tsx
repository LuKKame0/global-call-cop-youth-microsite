"use client";

import Link from "next/link";

import { localizedLandingHref } from "@/lib/i18n/page-paths";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

export function BuildTheFuturePageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.buildTheFuture;

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(97,200,121,0.08),transparent_30%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-4 pt-4 sm:px-5 lg:px-8">
        <Link
          href={localizedLandingHref(locale, "home")}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          {copy.backLink}
        </Link>
        <span className="ms-3 glass-chip px-3 py-1 text-xs uppercase tracking-[0.16em]">
          {copy.liveTag}
        </span>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-8 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8 lg:p-10">
          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.heroSubtitle}</p>
          <div className="mt-6">
            <Link href={localizedLandingHref(locale, "join")} className="glass-button-primary">
              {copy.heroCta}
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.metrics.map((metric) => (
              <article key={metric.label} className="glass-panel p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  {metric.label}
                </p>
                <p className="mt-2 font-display text-3xl uppercase tracking-[0.04em]">{metric.value}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{metric.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {[
        { title: copy.problemTitle, lead: copy.problemLead },
        { title: copy.buildingTitle, lead: copy.buildingLead },
        { title: copy.mapTitle, lead: copy.mapLead },
        { title: copy.rolesTitle, lead: copy.rolesLead },
      ].map((section) => (
        <section key={section.title} className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-8">
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {section.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
            {section.lead}
          </p>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-3 pb-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8">
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.enterTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)]">{copy.enterLead}</p>
          <Link href={localizedLandingHref(locale, "join")} className="glass-button-primary mt-6 inline-flex">
            {copy.enterCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
