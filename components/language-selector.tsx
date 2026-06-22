"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/config";
import { useApplyLocale, useCurrentLocale, useDictionary } from "@/lib/i18n/context";
import {
  landingSlugFromPathname,
  localizedLandingHref,
} from "@/lib/i18n/page-paths";
import { localeFromPathname } from "@/lib/i18n/path-locale";

export function LanguageSelector({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const locale = useCurrentLocale();
  const dictionary = useDictionary();
  const applyLocale = useApplyLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Locale | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function switchLocale(nextLocale: Locale) {
    if (nextLocale === (localeFromPathname(pathname) ?? locale)) {
      setOpen(false);
      return;
    }

    setPending(nextLocale);
    const slug = landingSlugFromPathname(pathname);

    if (slug) {
      router.push(localizedLandingHref(nextLocale, slug));
    } else {
      await applyLocale(nextLocale);
    }

    setPending(null);
    setOpen(false);
  }

  const pathLocale = localeFromPathname(pathname);
  const activeLocale = pathLocale ?? locale;

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={pending !== null}
        className={[
          "glass-button-secondary site-lang-button",
          compact ? "min-w-0" : "min-w-[9rem]",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={dictionary.language.choose}
        title={LOCALE_LABELS[activeLocale]}
      >
        <span className="site-lang-button-label">{LOCALE_LABELS[activeLocale]}</span>
        <span aria-hidden="true" className="shrink-0">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={dictionary.language.label}
          className="site-lang-menu absolute end-0 z-[60] mt-2 max-h-72 w-[min(16rem,calc(100vw-2rem))] overflow-y-auto p-2"
        >
          {LOCALES.map((entry) => (
            <li key={entry}>
              <button
                type="button"
                role="option"
                aria-selected={entry === activeLocale}
                disabled={pending === entry}
                onClick={() => void switchLocale(entry)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-start text-sm leading-snug transition",
                  entry === activeLocale
                    ? "bg-[var(--glass-button-secondary-bg)] text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--glass-button-secondary-bg)] hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                {LOCALE_LABELS[entry]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
