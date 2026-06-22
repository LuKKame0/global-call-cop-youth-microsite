import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth/middleware-auth";
import { LEGACY_HOSTS, ROUTES } from "@/lib/branding/routes";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import {
  BARE_LANDING_REDIRECTS,
  localizedLandingHref,
  stripErroneousLocalePrefix,
} from "@/lib/i18n/page-paths";
import { checkRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";

const RATE_LIMITED_PREFIXES = ["/api/"];

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function resolveRequestLocale(request: NextRequest, pathLocale?: string | null): Locale {
  if (pathLocale && isLocale(pathLocale)) {
    return pathLocale;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const candidate = part.split(";")[0]?.trim().toLowerCase();
      if (!candidate) continue;
      if (isLocale(candidate)) return candidate;
      if (candidate.startsWith("zh")) {
        if (
          candidate.includes("tw") ||
          candidate.includes("hk") ||
          candidate.includes("hant")
        ) {
          return "zh-TW";
        }
        return "zh-CN";
      }
      const base = candidate.split("-")[0];
      if (base && isLocale(base)) return base;
    }
  }

  return DEFAULT_LOCALE;
}

function withLocaleHeaders(response: NextResponse, locale: Locale) {
  response.headers.set("x-tgc-locale", locale);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function localeRouting(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (pathname === "/org" || pathname === "/org/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  const strippedPath = stripErroneousLocalePrefix(pathname);
  if (strippedPath) {
    const locale = isLocale(first!) ? first : resolveRequestLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    return withLocaleHeaders(NextResponse.redirect(url), locale as Locale);
  }

  if (first && isLocale(first)) {
    return withLocaleHeaders(NextResponse.next(), first);
  }

  const bareTarget = BARE_LANDING_REDIRECTS[pathname];
  if (bareTarget) {
    const locale = resolveRequestLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = localizedLandingHref(locale, bareTarget);
    return withLocaleHeaders(NextResponse.redirect(url), locale);
  }

  return null;
}

function legacyHostRedirect(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  if (!LEGACY_HOSTS.includes(host as (typeof LEGACY_HOSTS)[number])) {
    return null;
  }

  const { pathname, search } = request.nextUrl;
  let targetPath = pathname;

  if (pathname === "/" || pathname === "") {
    targetPath = ROUTES.insights;
  } else if (pathname.startsWith("/framework")) {
    targetPath = pathname.replace(/^\/framework/, ROUTES.insights);
  }

  const url = new URL(`https://theglobalcall.org${targetPath}${search}`);
  return NextResponse.redirect(url, 308);
}

function marketingRewrite(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/marketing/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/org") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/sandbox")
  ) {
    return null;
  }

  if (LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return null;
  }

  if (pathname === "/index.html") {
    return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }

  return null;
}

export default auth((req) => {
  const legacyResponse = legacyHostRedirect(req);
  if (legacyResponse) {
    return legacyResponse;
  }

  const localeResponse = localeRouting(req);
  if (localeResponse) {
    if (localeResponse.status !== 200) {
      return localeResponse;
    }
  }

  const marketingResponse = marketingRewrite(req);
  if (marketingResponse) {
    const locale = resolveRequestLocale(req);
    return withLocaleHeaders(marketingResponse, locale);
  }

  const { pathname } = req.nextUrl;

  if (RATE_LIMITED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const ip = getClientIp(req);
    const result = checkRateLimit(ip, pathname);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders(result) },
      );
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(rateLimitHeaders(result))) {
      response.headers.set(key, value);
    }
    return withLocaleHeaders(response, resolveRequestLocale(req));
  }

  if (localeResponse) {
    return localeResponse;
  }

  return withLocaleHeaders(NextResponse.next(), resolveRequestLocale(req));
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
