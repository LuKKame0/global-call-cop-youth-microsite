import { isLocale, type Locale } from "@/lib/i18n/config";

/** Dashboard/auth routes that must never live under /{locale}/… */
export const APP_SHELL_ROUTE_PREFIXES = [
  "admin",
  "org",
  "dashboard",
  "login",
  "verify",
  "auth",
  "preview",
  "sandbox",
  "api",
] as const;

export type AppShellRoutePrefix = (typeof APP_SHELL_ROUTE_PREFIXES)[number];

export function isAppShellRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return false;

  const first = segments[0];
  if (first && isLocale(first)) {
    const second = segments[1];
    return Boolean(second && (APP_SHELL_ROUTE_PREFIXES as readonly string[]).includes(second));
  }

  return (APP_SHELL_ROUTE_PREFIXES as readonly string[]).includes(first);
}

/** /fr/admin/leads → /admin/leads */
export function stripErroneousLocalePrefix(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (!first || !isLocale(first) || segments.length < 2) {
    return null;
  }

  const second = segments[1];
  if (!(APP_SHELL_ROUTE_PREFIXES as readonly string[]).includes(second)) {
    return null;
  }

  return `/${segments.slice(1).join("/")}`;
}

/** Public landing routes that support /{locale}/… URLs */
export const LOCALIZED_LANDING_SLUGS = [
  "join",
  "z-cop",
  "activities",
  "insights",
  "faq",
  "build-the-future",
  "on-my-way",
  "mesa",
  "directory",
  "advocacy",
  "team",
] as const;

export type LocalizedLandingSlug = (typeof LOCALIZED_LANDING_SLUGS)[number];

export function localizedLandingHref(locale: Locale, slug: LocalizedLandingSlug | "home"): string {
  if (slug === "home") return `/${locale}`;
  return `/${locale}/${slug}`;
}

export function landingSlugFromPathname(pathname: string): LocalizedLandingSlug | "home" | null {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (!first || !isLocale(first)) return null;
  if (segments.length === 1) return "home";
  const slug = segments[1];
  if ((LOCALIZED_LANDING_SLUGS as readonly string[]).includes(slug)) {
    return slug as LocalizedLandingSlug;
  }
  return null;
}

/** Legacy bare paths that redirect to localized URLs */
export const BARE_LANDING_REDIRECTS: Record<string, LocalizedLandingSlug | "home"> = {
  "/": "home",
  "/insights": "insights",
  "/faq": "faq",
  "/buildthefuture": "build-the-future",
  "/build-the-future": "build-the-future",
  "/join": "join",
  "/z-cop": "z-cop",
  "/activities": "activities",
  "/sandbox/on-my-way": "on-my-way",
  "/mesa": "mesa",
  "/directory": "directory",
  "/advocacy": "advocacy",
  "/team": "team",
};
