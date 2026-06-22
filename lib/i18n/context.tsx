"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  LOCALE_COOKIE,
  isLocale,
  isRtlLocale,
  type Locale,
} from "@/lib/i18n/config";
import { loadDictionary } from "@/lib/i18n/dictionary-loaders";
import { localeFromPathname } from "@/lib/i18n/path-locale";
import type { Dictionary } from "@/lib/i18n/types";

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return value && isLocale(value) ? value : null;
}

function writeCookieLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
}

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  applyLocale: (locale: Locale) => Promise<void>;
};

type LocaleProviderProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale: initialLocale,
  dictionary: initialDictionary,
  children,
}: LocaleProviderProps) {
  const pathname = usePathname();
  const [locale, setLocale] = useState(initialLocale);
  const [dictionary, setDictionary] = useState(initialDictionary);
  const activeLocaleRef = useRef(initialLocale);

  const syncLocale = useCallback(async (target: Locale) => {
    if (activeLocaleRef.current === target) {
      return;
    }

    const nextDictionary = await loadDictionary(target);
    activeLocaleRef.current = target;
    setLocale(target);
    setDictionary(nextDictionary);
    applyDocumentLocale(target);
    writeCookieLocale(target);
  }, []);

  useEffect(() => {
    const pathLocale = localeFromPathname(pathname);
    const target = pathLocale ?? readCookieLocale() ?? initialLocale;
    void syncLocale(target);
  }, [pathname, initialLocale, syncLocale]);

  const applyLocale = useCallback(
    async (nextLocale: Locale) => {
      await syncLocale(nextLocale);
    },
    [syncLocale],
  );

  const value = useMemo(
    () => ({ locale, dictionary, applyLocale }),
    [applyLocale, dictionary, locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useDictionary() {
  return useLocale().dictionary;
}

export function useCurrentLocale() {
  return useLocale().locale;
}

export function useApplyLocale() {
  return useLocale().applyLocale;
}
