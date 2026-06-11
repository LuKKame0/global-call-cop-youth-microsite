"use client";

import Link from "next/link";

import { IconArrow } from "@/components/icons";
import { localizedLandingHref } from "@/lib/i18n/page-paths";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

function SectionBlock({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)] sm:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
          {lead}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function HomePageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.home;

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,171,250,0.1),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,70,13,0.07),transparent_24%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.heroEyebrow}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,8vw,5.5rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.heroTitle}{" "}
            <span className="text-[var(--text-muted)]">{copy.heroTitleDim}</span>
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            {copy.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={localizedLandingHref(locale, "join")} className="glass-button-primary">
              <IconArrow className="h-4 w-4" />
              {copy.heroCtaJoin}
            </Link>
            <Link href={localizedLandingHref(locale, "join")} className="glass-button-secondary">
              {copy.heroCtaFocalPoint}
            </Link>
            <Link href={localizedLandingHref(locale, "insights")} className="glass-button-secondary">
              {copy.heroCtaFramework}
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {copy.metrics.map((metric) => (
              <article key={metric.label} className="glass-panel p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {metric.label}
                </p>
                <p className="mt-2 font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{metric.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionBlock
        id="problem"
        eyebrow={copy.problemEyebrow}
        title={copy.problemTitle}
        lead={copy.problemLead}
      >
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {copy.problems.map((item) => (
            <li key={item.title} className="glass-panel p-5">
              <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{item.body}</p>
            </li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock
        id="platform"
        eyebrow={copy.platformEyebrow}
        title={copy.platformTitle}
        lead={copy.platformLead}
      >
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {copy.platformPoints.map((item) => (
            <article key={item.title} className="glass-panel p-5">
              <h3 className="font-display text-xl uppercase tracking-[0.04em] text-[var(--brand-blue)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        id="framework"
        eyebrow={copy.frameworkEyebrow}
        title={copy.frameworkTitle}
        lead={copy.frameworkLead}
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.frameworkThemes.map((item) => (
            <article key={item.title} className="glass-panel p-5">
              <h3 className="font-display text-2xl uppercase tracking-[0.04em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        id="network"
        eyebrow={copy.networkEyebrow}
        title={copy.networkTitle}
        lead={copy.networkLead}
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {copy.networkStats.map((stat) => (
            <article key={stat.label} className="glass-panel p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{stat.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock eyebrow={copy.impactEyebrow} title={copy.impactTitle} lead={copy.impactLead} />

      <section id="join" className="mx-auto max-w-7xl px-3 pb-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.joinEyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.joinTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
            {copy.joinLead}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={localizedLandingHref(locale, "join")} className="glass-button-primary">
              {copy.joinCtaApply}
            </Link>
            <Link href={localizedLandingHref(locale, "activities")} className="glass-button-secondary">
              {copy.joinCtaPartner}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
