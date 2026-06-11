export const PRIMARY_DOMAIN = "theglobalcall.org";

export const ROUTES = {
  home: "/",
  buildTheFuture: "/buildthefuture",
  insights: "/insights",
  faq: "/faq",
  join: "/join",
  zCop: "/z-cop",
  activities: "/activities",
} as const;

export const LEGACY_HOSTS = [
  "youthframework.theglobalcall.org",
  "insights.theglobalcall.org",
] as const;

export function resolveAppOrigin() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return `https://${PRIMARY_DOMAIN}`;
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return `https://${PRIMARY_DOMAIN}`;
  }
}

export function insightsPath(withHash = false) {
  return withHash ? `${ROUTES.insights}#framework-form` : ROUTES.insights;
}
