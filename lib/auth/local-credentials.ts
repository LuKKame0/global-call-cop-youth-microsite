import "server-only";

import { eq } from "drizzle-orm";

import {
  isAccessTokenConfigured,
  verifyAccessToken,
} from "@/lib/auth/access-token";
import {
  assertLoginAllowed,
  clearLoginAttempts,
  LoginLockedError,
  recordFailedLogin,
} from "@/lib/auth/login-throttle";
import { getDb } from "@/lib/db";
import { userOrgRoles, users } from "@/lib/db/schema";
import { sanitizeEnv } from "@/lib/env/sanitize";

export function parseAdminEmails() {
  const raw = sanitizeEnv(process.env.AUTH_ADMIN_EMAILS);
  if (!raw) return [];

  return raw
    .split(/[,;]/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isLocalAuthConfigured() {
  return Boolean(
    process.env.DATABASE_URL?.trim() &&
      parseAdminEmails().length &&
      isAccessTokenConfigured(),
  );
}

export function isAccessTokenAuthAvailable() {
  return isLocalAuthConfigured();
}

async function userHasDashboardAccess(userId: string) {
  const roles = await getDb()
    .select({ id: userOrgRoles.id })
    .from(userOrgRoles)
    .where(eq(userOrgRoles.userId, userId))
    .limit(1);

  return roles.length > 0;
}

export async function authorizeLocalAdmin(email: string, accessToken: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = parseAdminEmails();

  if (!allowedEmails.includes(normalizedEmail)) {
    await recordFailedLogin(normalizedEmail).catch(() => null);
    return null;
  }

  try {
    await assertLoginAllowed(normalizedEmail);
  } catch (error) {
    if (error instanceof LoginLockedError) {
      return null;
    }
    throw error;
  }

  if (!verifyAccessToken(accessToken)) {
    await recordFailedLogin(normalizedEmail).catch(() => null);
    return null;
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    await recordFailedLogin(normalizedEmail).catch(() => null);
    return null;
  }

  const hasAccess = await userHasDashboardAccess(user.id);
  if (!hasAccess) {
    await recordFailedLogin(normalizedEmail).catch(() => null);
    return null;
  }

  await clearLoginAttempts(normalizedEmail);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
