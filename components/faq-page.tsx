"use client";

import Link from "next/link";

import { THEME_DEFINITIONS } from "@/lib/content";
import { localizedLandingHref } from "@/lib/i18n/page-paths";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

const themeKeys = ["self", "community", "institutions", "systems"] as const;

export function FaqPage() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.faq;

  return (
    <div className="relative overflow-hidden pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,70,13,0.085),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(55,171,250,0.095),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,145,254,0.065),transparent_30%)]" />

      <section className="mx-auto max-w-7xl px-3 pb-5 pt-4 sm:px-5 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="glass-panel-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="relative flex flex-col gap-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/58">{copy.eyebrow}</p>
            <h1 className="max-w-4xl font-display text-[clamp(2.2rem,9vw,6rem)] uppercase leading-[0.88] tracking-[0.05em] text-white">
              {copy.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/68 sm:text-base">{copy.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={localizedLandingHref(locale, "insights")} className="glass-button-primary">
                {copy.ctaFramework}
              </Link>
              <Link href={localizedLandingHref(locale, "home")} className="glass-button-secondary">
                {copy.ctaHome}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.processEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.04em] text-white sm:text-5xl">
              {copy.processTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/58 sm:text-base">{copy.processLead}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.stages.map((stage, index) => (
            <article key={stage.title} className="glass-panel p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/36">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{stage.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{stage.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.examplesEyebrow}</p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.04em] text-white sm:text-5xl">
            {copy.examplesTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">{copy.examplesLead}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {copy.examples.map((example) => (
            <article key={example.country} className="glass-panel p-6">
              <h3 className="font-display text-4xl uppercase tracking-[0.04em] text-white">
                {example.country}
              </h3>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                {example.youthStructure}
              </p>
              <p className="mt-5 text-sm leading-7 text-white/60">{example.profile}</p>
              <div className="mt-6 grid gap-3">
                {themeKeys.map((key, index) => (
                  <div
                    key={key}
                    className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4"
                  >
                    <p
                      className="text-[11px] uppercase tracking-[0.22em]"
                      style={{ color: THEME_DEFINITIONS[index]?.accentToken }}
                    >
                      {dictionary.insights.themes[index]?.shortLabel ?? key}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/58">{example.themes[key]}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.faqEyebrow}</p>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.04em] text-white sm:text-5xl">
          {copy.faqTitle}
        </h2>
        <div className="mt-6 grid gap-3">
          {copy.items.map((item) => (
            <details key={item.question} className="glass-panel group overflow-hidden p-5">
              <summary className="cursor-pointer list-none text-base font-semibold text-white">
                {item.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-white/58">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
