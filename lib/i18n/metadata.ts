import type { Metadata } from "next";

import { LOCALES } from "@/lib/i18n/config";
import { parseLocaleParam } from "@/lib/i18n/parse-locale-param";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type LocalizedMeta = {
  title: string;
  description: string;
};

function resolveAppUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export async function buildLocalizedMetadata(
  params: Promise<{ locale: string }>,
  selector: (dict: Awaited<ReturnType<typeof getDictionary>>) => LocalizedMeta,
): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = parseLocaleParam(localeParam);
  const dictionary = await getDictionary(locale);
  const meta = selector(dictionary);
  const appUrl = resolveAppUrl();

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((entry) => [entry, `/${entry}`])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: new URL(`/${locale}`, appUrl).toString(),
      locale,
      images: [{ url: "/globalcall.png", width: 512, height: 512, alt: "The Global Call" }],
    },
  };
}
