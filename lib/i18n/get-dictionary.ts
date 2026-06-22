import type { Locale } from "@/lib/i18n/config";
import { loadDictionary } from "@/lib/i18n/dictionary-loaders";

export async function getDictionary(locale: Locale) {
  return loadDictionary(locale);
}
