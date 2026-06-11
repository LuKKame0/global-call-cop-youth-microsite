import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { CoreDictionary } from "@/lib/i18n/core-dictionary";
import { en } from "@/lib/i18n/dictionaries/en";
import { mergeDictionary } from "@/lib/i18n/merge-dictionary";
import type { Dictionary, PageDictionary } from "@/lib/i18n/types";

const coreLoaders: Record<Locale, () => Promise<CoreDictionary>> = {
  en: async () => {
    const module = await import("@/lib/i18n/dictionaries/en");
    return module.enCore as CoreDictionary;
  },
  fr: async () => (await import("@/lib/i18n/dictionaries/fr")).fr as CoreDictionary,
  es: async () => (await import("@/lib/i18n/dictionaries/es")).es as CoreDictionary,
  ru: async () => (await import("@/lib/i18n/dictionaries/ru")).ru as CoreDictionary,
  pt: async () => (await import("@/lib/i18n/dictionaries/pt")).pt as CoreDictionary,
  de: async () => (await import("@/lib/i18n/dictionaries/de")).de as CoreDictionary,
  it: async () => (await import("@/lib/i18n/dictionaries/it")).it as CoreDictionary,
  ar: async () => (await import("@/lib/i18n/dictionaries/ar")).ar as CoreDictionary,
  sw: async () => (await import("@/lib/i18n/dictionaries/sw")).sw as CoreDictionary,
  ha: async () => (await import("@/lib/i18n/dictionaries/ha")).ha as CoreDictionary,
  fa: async () => (await import("@/lib/i18n/dictionaries/fa")).fa as CoreDictionary,
  tr: async () => (await import("@/lib/i18n/dictionaries/tr")).tr as CoreDictionary,
  he: async () => (await import("@/lib/i18n/dictionaries/he")).he as CoreDictionary,
  "zh-CN": async () => (await import("@/lib/i18n/dictionaries/zh-CN")).zhCN as CoreDictionary,
  "zh-TW": async () => (await import("@/lib/i18n/dictionaries/zh-TW")).zhTW as CoreDictionary,
};

const pageLoaders: Record<Locale, () => Promise<PageDictionary>> = {
  en: async () => (await import("@/lib/i18n/pages/en")).pagesEn,
  fr: async () => (await import("@/lib/i18n/pages/fr")).pagesFr,
  es: async () => (await import("@/lib/i18n/pages/es")).pagesEs,
  ru: async () => (await import("@/lib/i18n/pages/ru")).pagesRu,
  pt: async () => (await import("@/lib/i18n/pages/pt")).pagesPt,
  de: async () => (await import("@/lib/i18n/pages/de")).pagesDe,
  it: async () => (await import("@/lib/i18n/pages/it")).pagesIt,
  ar: async () => (await import("@/lib/i18n/pages/ar")).pagesAr,
  sw: async () => (await import("@/lib/i18n/pages/sw")).pagesSw,
  ha: async () => (await import("@/lib/i18n/pages/ha")).pagesHa,
  fa: async () => (await import("@/lib/i18n/pages/fa")).pagesFa,
  tr: async () => (await import("@/lib/i18n/pages/tr")).pagesTr,
  he: async () => (await import("@/lib/i18n/pages/he")).pagesHe,
  "zh-CN": async () => (await import("@/lib/i18n/pages/zh-CN")).pagesZhCN,
  "zh-TW": async () => (await import("@/lib/i18n/pages/zh-TW")).pagesZhTW,
};

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const [core, pages] = await Promise.all([
      coreLoaders[locale](),
      pageLoaders[locale]().catch(() => pageLoaders[DEFAULT_LOCALE]()),
    ]);
    return mergeDictionary(core, pages);
  } catch {
    return en;
  }
}
