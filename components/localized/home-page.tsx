"use client";

import { IconArrow } from "@/components/icons";
import { CtaRow } from "@/components/ui/cta-row";
import { PageGlow } from "@/components/ui/page-glow";
import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { InfoCard } from "@/components/ui/info-card";
import { localizedLandingHref } from "@/lib/i18n/page-paths";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

export function HomePageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.home;

  return (
    <div className="relative overflow-hidden pb-12">
      <PageGlow color="blue" />

      <PageHero
        eyebrow={copy.heroEyebrow}
        title={
          <>
            {copy.heroTitle} <span className="text-[var(--text-muted)]">{copy.heroTitleDim}</span>
          </>
        }
        lead={copy.heroSubtitle}
        cta={[
          {
            href: localizedLandingHref(locale, "join"),
            label: copy.heroCtaJoin,
            icon: <IconArrow className="h-4 w-4" />,
          },
          { href: localizedLandingHref(locale, "join"), label: copy.heroCtaFocalPoint, variant: "secondary" },
          {
            href: localizedLandingHref(locale, "insights"),
            label: copy.heroCtaFramework,
            variant: "secondary",
          },
        ]}
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {copy.metrics.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} />
          ))}
        </div>
      </PageHero>

      <SectionBlock id="problem" eyebrow={copy.problemEyebrow} title={copy.problemTitle} lead={copy.problemLead}>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {copy.problems.map((item) => (
            <li key={item.title}>
              <InfoCard title={item.title} body={item.body} />
            </li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock id="platform" eyebrow={copy.platformEyebrow} title={copy.platformTitle} lead={copy.platformLead}>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {copy.platformPoints.map((item) => (
            <InfoCard key={item.title} title={item.title} body={item.body} accent />
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
            <InfoCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="network" eyebrow={copy.networkEyebrow} title={copy.networkTitle} lead={copy.networkLead}>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {copy.networkStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock eyebrow={copy.impactEyebrow} title={copy.impactTitle} lead={copy.impactLead} />

      <section id="join" className="mx-auto max-w-7xl px-3 pb-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">{copy.joinEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)] sm:text-4xl">{copy.joinTitle}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
            {copy.joinLead}
          </p>
          <CtaRow
            primary={{ href: localizedLandingHref(locale, "join"), label: copy.joinCtaApply }}
            secondary={[{ href: localizedLandingHref(locale, "activities"), label: copy.joinCtaPartner }]}
          />
        </div>
      </section>
    </div>
  );
}
