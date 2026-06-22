import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n/config";

export function parseLocaleParam(value: string): Locale {
  if (!isLocale(value)) {
    notFound();
  }
  return value;
}
