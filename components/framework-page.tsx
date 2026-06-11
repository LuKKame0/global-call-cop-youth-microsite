"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { THEME_DEFINITIONS } from "@/lib/content";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";
import { localizedLandingHref } from "@/lib/i18n/page-paths";

import { MobileCarousel } from "@/components/mobile-carousel";
import { SubmissionWizard } from "@/components/submission-wizard";

export function FrameworkPage() {
  const { insights } = useDictionary();
  const locale = useCurrentLocale();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formSectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (window.location.hash === "#framework-form") {
      const timeoutId = window.setTimeout(() => {
        setIsFormVisible(true);
        formSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  const handleRevealForm = () => {
    if (isFormVisible) {
      formSectionRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      return;
    }

    setIsFormVisible(true);

    window.setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }, reduceMotion ? 0 : 260);
  };

  return (
    <div className="relative overflow-x-clip pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(55,171,250,0.12),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(97,200,121,0.075),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,70,13,0.085),transparent_30%)]" />

      <section className="mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-5 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="glass-panel-strong relative overflow-hidden p-5 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,145,254,0.105),transparent_30%)]" />
            <div className="relative space-y-6">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                {insights.eyebrow}
              </p>
              <h1 className="max-w-3xl font-display text-[clamp(2.2rem,9vw,6.4rem)] uppercase leading-[0.92] tracking-[0.04em] text-white [overflow-wrap:anywhere] hyphens-auto sm:leading-[0.88] sm:tracking-[0.05em]">
                {insights.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {insights.subtitle}
              </p>
              <div className="glass-panel max-w-2xl p-5 text-sm leading-7 text-white/72">
                {insights.note}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRevealForm}
                  className="glass-button-primary"
                >
                  {isFormVisible ? insights.ctaReveal : insights.ctaReveal}
                </button>
                <Link
                  href={localizedLandingHref(locale, "faq")}
                  className="glass-button-secondary"
                >
                  {insights.ctaFaq}
                </Link>
              </div>
            </div>
          </div>

          <MobileCarousel desktopClassName="gap-3">
            {insights.guides.map((guide, index) => (
              <article key={guide.title} className="glass-panel h-full p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/36">
                  0{index + 1}
                </p>
                <h2 className="mt-3 text-lg font-semibold text-white">{guide.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/58">{guide.body}</p>
              </article>
            ))}
          </MobileCarousel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-5 lg:px-8">
        <div className="mb-4 space-y-2 px-1">
          <h2 className="font-display text-2xl uppercase tracking-[0.04em] text-white sm:text-3xl">
            {insights.themesTitle}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-white/58">{insights.themesLead}</p>
        </div>
        <MobileCarousel desktopClassName="gap-3 grid-cols-2 xl:grid-cols-4">
          {insights.themes.map((theme, index) => {
            const accent = THEME_DEFINITIONS[index]?.accentToken ?? "#37ABFA";
            return (
              <article key={theme.shortLabel} className="glass-panel h-full p-5">
                <p
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: accent }}
                >
                  {theme.shortLabel}
                </p>
                <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white">
                  {theme.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/58">{theme.actionHint}</p>
              </article>
            );
          })}
        </MobileCarousel>
      </section>

      <section
        ref={formSectionRef}
        id="framework-form"
        className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-5 lg:px-8 lg:pb-16"
      >
        <AnimatePresence initial={false} mode="wait">
          {isFormVisible ? (
            <motion.div
              key="form-visible"
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="w-full min-w-0"
            >
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                    {insights.formEyebrow}
                  </p>
                  <h2 className="font-display text-3xl uppercase tracking-[0.03em] text-white [overflow-wrap:anywhere] sm:text-5xl sm:tracking-[0.04em]">
                    {insights.formTitle}
                  </h2>
                </div>
              </div>

              <SubmissionWizard />
            </motion.div>
          ) : (
            <motion.div
              key="form-hidden"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: reduceMotion ? 0 : 0.36, ease: "easeOut" }}
              className="glass-panel p-5 sm:p-8"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                {insights.formEyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.03em] text-white [overflow-wrap:anywhere] sm:text-5xl sm:tracking-[0.04em]">
                {insights.title}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58 sm:text-base">
                {insights.note}
              </p>
              <button
                type="button"
                onClick={handleRevealForm}
                className="glass-button-primary mt-6"
              >
                {insights.ctaReveal}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
