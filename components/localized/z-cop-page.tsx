"use client";

import Link from "next/link";

import { IconArrow } from "@/components/icons";
import { localizedHref } from "@/lib/i18n/config";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";
import { SANDBOX_CONTACT } from "@/lib/sandbox/content";

export function ZCopPageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.zCop;
  const common = dictionary.common;

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,171,250,0.08),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(97,200,121,0.06),transparent_24%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(3.2rem,10vw,7rem)] uppercase leading-[0.86] tracking-[0.05em] text-[var(--text-primary)]">
            {copy.title.split("-").length > 1 ? (
              <>
                Z<span className="text-[var(--brand-blue)]">-</span>COP
              </>
            ) : (
              copy.title
            )}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            {copy.heroDescription}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <span className="glass-chip px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
              {copy.dates}
            </span>
            <span className="text-sm text-[var(--text-muted)]">{copy.heroTag}</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary">
              <IconArrow className="h-4 w-4" />
              {common.requestOnboarding}
            </a>
            <Link href={localizedHref(locale, "join")} className="glass-button-secondary">
              {dictionary.nav.join}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
          {copy.problemEyebrow}
        </p>
        <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          {copy.problemTitle}
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="glass-panel p-6">
            <h3 className="font-display text-xl uppercase tracking-[0.04em] text-[var(--brand-pink)]">
              {copy.seeProblems}
            </h3>
            <ul className="mt-4 space-y-3">
              {copy.problems.map((item) => (
                <li key={item} className="text-sm leading-7 text-[var(--text-muted)]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="glass-panel p-6">
            <h3 className="font-display text-xl uppercase tracking-[0.04em] text-[var(--brand-green)]">
              {copy.ourResponse}
            </h3>
            <ul className="mt-4 space-y-3">
              {copy.solutions.map((item) => (
                <li key={item} className="text-sm leading-7 text-[var(--text-muted)]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
          {copy.pipelineEyebrow}
        </p>
        <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          {copy.pipelineTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          {copy.pipelineDescription}
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {copy.pipeline.map((platform, index) => (
            <article key={platform.name} className="glass-panel relative overflow-hidden p-6">
              <div
                className="absolute inset-y-0 start-0 w-1 rounded-e-full"
                style={{
                  backgroundColor: [
                    "var(--brand-blue)",
                    "var(--brand-green)",
                    "var(--brand-orange)",
                  ][index],
                }}
              />
              <p className="ps-3 text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {platform.role}
              </p>
              <h3 className="mt-3 ps-3 font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {platform.name}
              </h3>
              <p className="mt-4 ps-3 text-sm leading-7 text-[var(--text-muted)]">
                {platform.description}
              </p>
            </article>
          ))}
        </div>
        <p className="glass-panel mt-6 p-6 text-sm leading-7 text-[var(--text-muted)]">
          {copy.pipelineNote}
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
          {copy.themesEyebrow}
        </p>
        <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          {copy.themesTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          {copy.themesDescription}
        </p>
        <div className="mt-6 grid gap-4">
          {copy.themes.map((theme) => (
            <article key={theme.day} className="glass-panel p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {theme.day}
                </p>
                <h3 className="font-display text-2xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                  {theme.theme}
                </h3>
              </div>
              <p className="mt-2 text-sm text-[var(--brand-blue)]">{theme.scale}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{theme.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 sm:px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
          {copy.cycleEyebrow}
        </p>
        <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
          {copy.cycleTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
          {copy.cycleDescription}
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <tbody>
              {copy.dailyCycle.map((session) => (
                <tr key={`${session.time}-${session.session}`}>
                  <td className="glass-panel px-4 py-3 align-top text-[var(--text-faint)]">
                    {session.time}
                  </td>
                  <td className="glass-panel px-4 py-3 align-top font-medium text-[var(--text-primary)]">
                    {session.session}
                  </td>
                  <td className="glass-panel px-4 py-3 align-top text-[var(--text-muted)]">
                    {session.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="glass-panel mt-6 p-5 text-sm leading-7 text-[var(--text-muted)]">
          {copy.cyclePrinciples}
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-3 pb-4 sm:px-5 lg:px-8">
        <div className="glass-panel-strong p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
            {copy.partnerEyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
            {copy.partnerTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            {copy.partnerDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${SANDBOX_CONTACT.email}`} className="glass-button-primary">
              {copy.partnerEmailCta}
            </a>
            <Link href={localizedHref(locale, "activities")} className="glass-button-secondary">
              {common.partnerWithZCop}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
