"use client";

import Image from "next/image";
import Link from "next/link";

import { IconArrow, IconDoc } from "@/components/icons";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";
import { localizedLandingHref } from "@/lib/i18n/page-paths";

export function SiteFooter() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.footer;

  return (
    <footer className="px-3 pb-5 pt-10 sm:px-5 sm:pb-8 sm:pt-14">
      <div className="site-footer-shell mx-auto max-w-7xl rounded-[2rem] border p-6 backdrop-blur-xl sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] sm:h-28 sm:w-28">
                <Image
                  src="/globalcall.png"
                  alt={dictionary.meta.brand}
                  width={140}
                  height={140}
                  className="site-brand-logo h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              </span>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {copy.eyebrow}
              </p>
            </div>
            <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[var(--text-primary)] sm:text-5xl">
              {copy.title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              {copy.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={`${localizedLandingHref(locale, "insights")}#framework-form`}
              className="glass-button-primary justify-center"
            >
              <IconArrow className="h-4 w-4" />
              {copy.startFramework}
            </Link>
            <Link
              href={localizedLandingHref(locale, "faq")}
              className="glass-button-secondary justify-center"
            >
              <IconDoc className="h-4 w-4" />
              {copy.reviewFaq}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--glass-border)] pt-5 text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
          <span>{copy.organizedBy}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)]" />
          <span>{copy.digitalPlatform}</span>
        </div>
      </div>
    </footer>
  );
}
