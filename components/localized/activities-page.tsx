"use client";

import Link from "next/link";

import { IconArrow } from "@/components/icons";
import { localizedHref } from "@/lib/i18n/config";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

export function ActivitiesPageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.activities;
  const common = dictionary.common;

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,171,250,0.08),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,70,13,0.06),transparent_24%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-[clamp(3rem,8vw,5.5rem)] uppercase leading-[0.9] tracking-[0.04em] text-[var(--text-primary)]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            {copy.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.programmesEyebrow}
          </p>
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.programmesTitle}
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {copy.programmes.map((programme, index) => (
            <article key={programme.name} className="glass-panel relative overflow-hidden p-6">
              <div
                className="absolute inset-y-0 start-0 w-1 rounded-e-full"
                style={{
                  backgroundColor:
                    index === 0 ? "var(--brand-blue)" : "var(--brand-orange)",
                }}
              />
              <p className="ps-3 text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {programme.role}
              </p>
              <h3 className="mt-3 ps-3 font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {programme.name}
              </h3>
              <p className="mt-4 ps-3 text-sm leading-7 text-[var(--text-muted)]">
                {programme.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.otherEyebrow}
          </p>
          <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.otherTitle}
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {copy.otherActivities.map((activity) => (
            <article key={activity.name} className="glass-panel p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {activity.role}
              </p>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {activity.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                {activity.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.partnerEyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.partnerTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            {copy.partnerDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={localizedHref(locale, "z-cop")} className="glass-button-primary">
              <IconArrow className="h-4 w-4" />
              {copy.partnerCta}
            </Link>
            <Link href={localizedHref(locale, "join")} className="glass-button-secondary">
              {common.learnMore}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
