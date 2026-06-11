const store = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/submit": { limit: 10, windowMs: 60_000 },
  "/api/search": { limit: 30, windowMs: 60_000 },
  "/api/reports": { limit: 10, windowMs: 60_000 },
  "/api/reports/pdf": { limit: 5, windowMs: 60_000 },
  "/api/export": { limit: 10, windowMs: 60_000 },
  "/api/organizations": { limit: 20, windowMs: 60_000 },
  default: { limit: 60, windowMs: 60_000 },
};

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

function resolveRateLimitConfig(pathname: string): RateLimitConfig {
  if (pathname.startsWith("/api/auth/callback/credentials")) {
    return { limit: 10, windowMs: 900_000 };
  }

  if (pathname.startsWith("/api/auth/")) {
    return { limit: 30, windowMs: 60_000 };
  }

  return RATE_LIMITS[pathname] ?? RATE_LIMITS.default;
}

export function checkRateLimit(
  ip: string,
  pathname: string,
): RateLimitResult {
  cleanup();

  const config = resolveRateLimitConfig(pathname);
  const rateLimitKey = pathname.startsWith("/api/auth/callback/credentials")
    ? "/api/auth/callback/credentials"
    : pathname.startsWith("/api/auth/")
      ? "/api/auth"
      : pathname;
  const key = `${ip}:${rateLimitKey}`;
  const now = Date.now();

  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, limit: config.limit, remaining: config.limit - 1, resetAt: now + config.windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, config.limit - entry.count);
  return {
    allowed: entry.count <= config.limit,
    limit: config.limit,
    remaining,
    resetAt: entry.resetAt,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
