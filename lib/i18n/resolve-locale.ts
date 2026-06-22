import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  isLocale,
} from "@/lib/i18n/config";

function parseAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  const candidates = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (isLocale(candidate)) return candidate;
    if (candidate.startsWith("zh")) {
      if (candidate.includes("tw") || candidate.includes("hk") || candidate.includes("hant")) {
        return "zh-TW";
      }
      return "zh-CN";
    }
    const base = candidate.split("-")[0];
    if (base && isLocale(base)) return base;
  }

  return null;
}

export async function resolveLocale(pathLocale?: string): Promise<Locale> {
  if (pathLocale && isLocale(pathLocale)) {
    return pathLocale;
  }

  const headerStore = await headers();
  const middlewareLocale = headerStore.get("x-tgc-locale");
  if (middlewareLocale && isLocale(middlewareLocale)) {
    return middlewareLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const accepted = parseAcceptLanguage(headerStore.get("accept-language"));
  if (accepted) {
    return accepted;
  }

  return DEFAULT_LOCALE;
}
