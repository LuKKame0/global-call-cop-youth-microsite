import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { hashPassword } from "@/lib/auth/password";
import { parseAdminEmails } from "@/lib/auth/local-credentials";
import { sanitizeEnv } from "@/lib/env/sanitize";

import * as schema from "./schema";

async function setAdminPasswords() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is required");

  const password = sanitizeEnv(process.env.AUTH_ADMIN_PASSWORD);
  if (!password) {
    throw new Error("AUTH_ADMIN_PASSWORD is required for this one-time setup command.");
  }

  const emails = parseAdminEmails();
  if (emails.length === 0) {
    throw new Error("AUTH_ADMIN_EMAILS must list at least one admin email.");
  }

  const passwordHash = await hashPassword(password);
  const db = drizzle(neon(url), { schema });

  for (const email of emails) {
    const updated = await db
      .update(schema.users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(schema.users.email, email))
      .returning({ email: schema.users.email });

    if (updated.length === 0) {
      console.warn(`No user found for ${email} — run db:ensure-admins first.`);
      continue;
    }

    console.log(`Password hash set for ${email}`);
  }

  console.log("Done. Remove AUTH_ADMIN_PASSWORD from production env after setup.");
}

setAdminPasswords().catch((error) => {
  console.error("setAdminPasswords failed:", error);
  process.exit(1);
});
