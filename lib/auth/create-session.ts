import "server-only";

import { encode } from "@auth/core/jwt";
import { eq } from "drizzle-orm";

import { sanitizeEnv } from "@/lib/env/sanitize";
import { getDb } from "@/lib/db";
import { userOrgRoles, users } from "@/lib/db/schema";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

function getSessionCookieConfig() {
  const secure = process.env.NODE_ENV === "production";
  return {
    name: secure ? "__Secure-authjs.session-token" : "authjs.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure,
    },
  };
}

export async function buildSessionCookie(userId: string) {
  const secret = sanitizeEnv(process.env.AUTH_SECRET);
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const roles = await getDb()
    .select()
    .from(userOrgRoles)
    .where(eq(userOrgRoles.userId, userId));

  const token = {
    name: user.name,
    email: user.email,
    picture: user.image,
    sub: user.id,
    userId: user.id,
    roles: roles.map((role) => ({
      organizationId: role.organizationId,
      role: role.role,
      region: role.region,
      countryCode: role.countryCode,
    })),
  };

  const cookieConfig = getSessionCookieConfig();
  const value = await encode({
    token,
    secret,
    salt: cookieConfig.name,
    maxAge: SESSION_MAX_AGE,
  });

  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  return {
    name: cookieConfig.name,
    value,
    options: {
      ...cookieConfig.options,
      expires,
    },
  };
}

export async function createSessionForUser(userId: string) {
  const sessionCookie = await buildSessionCookie(userId);
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
}
