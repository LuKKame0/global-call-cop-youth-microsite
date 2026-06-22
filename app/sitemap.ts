import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n/config";
import { LOCALIZED_LANDING_SLUGS } from "@/lib/i18n/page-paths";

function resolveAppUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

const APP_URL = resolveAppUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const legacyPaths = ["/insights", "/faq", "/buildthefuture", "/join", "/activities", "/z-cop", "/mesa"];

  for (const locale of LOCALES) {
    entries.push({
      url: new URL(`/${locale}`, APP_URL).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    });

    for (const slug of LOCALIZED_LANDING_SLUGS) {
      entries.push({
        url: new URL(`/${locale}/${slug}`, APP_URL).toString(),
        lastModified,
        changeFrequency: "weekly",
        priority: slug === "insights" ? 0.9 : 0.7,
      });
    }
  }

  for (const path of legacyPaths) {
    entries.push({
      url: new URL(path, APP_URL).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: path === "/insights" ? 0.8 : 0.6,
    });
  }

  return entries;
}
