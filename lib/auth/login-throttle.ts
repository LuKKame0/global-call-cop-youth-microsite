import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { loginAttempts } from "@/lib/db/schema";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export class LoginLockedError extends Error {
  constructor(public lockedUntil: Date) {
    super("Account temporarily locked due to failed sign-in attempts.");
    this.name = "LoginLockedError";
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function assertLoginAllowed(email: string) {
  const normalized = normalizeEmail(email);
  const [row] = await getDb()
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.email, normalized))
    .limit(1);

  if (!row?.lockedUntil) return;

  const lockedUntil = row.lockedUntil.getTime();
  if (lockedUntil > Date.now()) {
    throw new LoginLockedError(row.lockedUntil);
  }

  await getDb()
    .update(loginAttempts)
    .set({ failedCount: 0, lockedUntil: null })
    .where(eq(loginAttempts.email, normalized));
}

export async function recordFailedLogin(email: string) {
  const normalized = normalizeEmail(email);
  const now = new Date();

  const [row] = await getDb()
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.email, normalized))
    .limit(1);

  const nextCount = (row?.failedCount ?? 0) + 1;
  const lockedUntil =
    nextCount >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null;

  if (row) {
    await getDb()
      .update(loginAttempts)
      .set({
        failedCount: nextCount,
        lockedUntil,
        lastAttemptAt: now,
      })
      .where(eq(loginAttempts.email, normalized));
  } else {
    await getDb().insert(loginAttempts).values({
      email: normalized,
      failedCount: nextCount,
      lockedUntil,
      lastAttemptAt: now,
    });
  }

  if (lockedUntil) {
    throw new LoginLockedError(lockedUntil);
  }
}

export async function clearLoginAttempts(email: string) {
  const normalized = normalizeEmail(email);
  await getDb().delete(loginAttempts).where(eq(loginAttempts.email, normalized));
}
