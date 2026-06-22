import { PRIMARY_DOMAIN } from "@/lib/branding/routes";

function resolveAppUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return `https://${PRIMARY_DOMAIN}`;
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return `https://${PRIMARY_DOMAIN}`;
  }
}

export function buildSiteJsonLd(locale: string) {
  const appUrl = resolveAppUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "The Global Call",
      url: appUrl,
      logo: `${appUrl}/globalcall.png`,
      description:
        "Global coordination platform connecting youth, institutions, and allies to turn commitments into implemented policy.",
      sameAs: [`${appUrl}/${locale}`],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "The Global Call — Youth Policy Implementation",
      url: appUrl,
      inLanguage: locale,
      potentialAction: {
        "@type": "SearchAction",
        target: `${appUrl}/${locale}/insights`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}
