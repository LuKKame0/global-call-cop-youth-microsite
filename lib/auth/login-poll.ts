import { and, desc, eq, gt, isNotNull, isNull } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { loginPollRequests } from "@/lib/db/schema";

const POLL_TTL_MS = 15 * 60 * 1000;

export type LoginPollStatus = "pending" | "verified" | "claimed" | "expired" | "missing";

export async function createLoginPollRequest(email: string, pollToken: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = new Date(Date.now() + POLL_TTL_MS);

  await getDb()
    .insert(loginPollRequests)
    .values({
      pollToken,
      email: normalizedEmail,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: loginPollRequests.pollToken,
      set: {
        email: normalizedEmail,
        expiresAt,
        verifiedAt: null,
        userId: null,
        claimedAt: null,
      },
    });
}

export async function markLoginPollVerified(
  pollToken: string,
  userId: string,
  email: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const [row] = await getDb()
    .select()
    .from(loginPollRequests)
    .where(eq(loginPollRequests.pollToken, pollToken))
    .limit(1);

  if (!row) {
    throw new Error("Login poll not found");
  }

  if (row.email !== normalizedEmail) {
    throw new Error("Login poll email mismatch");
  }

  if (row.expiresAt.getTime() < now.getTime()) {
    throw new Error("Login poll expired");
  }

  if (row.verifiedAt && row.userId) {
    return row;
  }

  await getDb()
    .update(loginPollRequests)
    .set({ verifiedAt: now, userId })
    .where(eq(loginPollRequests.pollToken, pollToken));

  return row;
}

export async function markLatestPendingPollVerified(email: string, userId: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const [row] = await getDb()
    .select()
    .from(loginPollRequests)
    .where(
      and(
        eq(loginPollRequests.email, normalizedEmail),
        isNull(loginPollRequests.verifiedAt),
        gt(loginPollRequests.expiresAt, now),
      ),
    )
    .orderBy(desc(loginPollRequests.createdAt))
    .limit(1);

  if (!row) return null;

  await getDb()
    .update(loginPollRequests)
    .set({ verifiedAt: now, userId })
    .where(eq(loginPollRequests.pollToken, row.pollToken));

  return row.pollToken;
}

export async function getLoginPollStatus(
  pollToken: string,
): Promise<{ status: LoginPollStatus; userId?: string }> {
  const [row] = await getDb()
    .select()
    .from(loginPollRequests)
    .where(eq(loginPollRequests.pollToken, pollToken))
    .limit(1);

  if (!row) return { status: "missing" };
  if (row.expiresAt.getTime() < Date.now()) return { status: "expired" };
  if (row.claimedAt) return { status: "claimed", userId: row.userId ?? undefined };
  if (row.verifiedAt && row.userId) {
    return { status: "verified", userId: row.userId };
  }
  return { status: "pending" };
}

export async function claimLoginPoll(pollToken: string) {
  const claimed = await getDb()
    .update(loginPollRequests)
    .set({ claimedAt: new Date() })
    .where(
      and(
        eq(loginPollRequests.pollToken, pollToken),
        isNotNull(loginPollRequests.verifiedAt),
        isNotNull(loginPollRequests.userId),
        isNull(loginPollRequests.claimedAt),
      ),
    )
    .returning({ userId: loginPollRequests.userId, expiresAt: loginPollRequests.expiresAt });

  const row = claimed[0];
  if (!row?.userId) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;
  return row.userId;
}
