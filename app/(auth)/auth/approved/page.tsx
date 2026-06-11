import Link from "next/link";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/config";
import { markLoginPollVerified } from "@/lib/auth/login-poll";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

type Props = {
  searchParams: Promise<{ pollToken?: string }>;
};

async function resolveUserId(email: string, sessionUserId?: string) {
  if (sessionUserId) return sessionUserId;

  const [user] = await getDb()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  return user?.id;
}

export default async function AuthApprovedPage({ searchParams }: Props) {
  const session = await auth();
  const { pollToken } = await searchParams;
  const email = session?.user?.email;

  if (email && pollToken) {
    try {
      const userId = await resolveUserId(email, session?.user?.id);
      if (userId) {
        await markLoginPollVerified(pollToken, userId, email);
      }
    } catch (error) {
      console.error("[auth/approved]", error);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--page-background)" }}
    >
      <div className="glass-panel w-full max-w-lg p-8 text-center space-y-5">
        <div className="text-4xl" aria-hidden>
          ✓
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          You&apos;re signed in
        </h1>
        <p style={{ color: "var(--text-secondary, #888)" }}>
          Your sign-in was confirmed. Return to the browser where you requested access — it
          should open The Global Call admin panel automatically.
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary, #666)" }}>
          You can now access the admin panel from that device. If this is the same device,
          open the dashboard below.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="glass-button-primary px-5 py-3 rounded-lg font-medium">
            Open dashboard
          </Link>
          <Link href="/" className="glass-button-secondary px-5 py-3 rounded-lg font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
