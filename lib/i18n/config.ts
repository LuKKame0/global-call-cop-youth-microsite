export const LOCALE_COOKIE = "tgc-locale";

export const DEFAULT_LOCALE = "en" as const;

export const LOCALES = [
  "en",
  "fr",
  "es",
  "ru",
  "pt",
  "de",
  "it",
  "ar",
  "sw",
  "ha",
  "fa",
  "tr",
  "he",
  "zh-CN",
  "zh-TW",
] as const;

export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar", "fa", "he"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ru: "Русский",
  pt: "Português",
  de: "Deutsch",
  it: "Italiano",
  ar: "العربية",
  sw: "Kiswahili",
  ha: "Hausa",
  fa: "فارسی",
  tr: "Türkçe",
  he: "עברית",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isRtlLocale(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export const LOCALIZED_PATHS = ["join", "z-cop", "activities"] as const;

export type LocalizedPath = (typeof LOCALIZED_PATHS)[number];

export function localizedHref(locale: Locale, path: LocalizedPath): string {
  return `/${locale}/${path}`;
}
