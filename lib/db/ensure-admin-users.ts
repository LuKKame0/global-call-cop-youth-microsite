import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { parseAdminEmails } from "@/lib/env/admin-emails";

import * as schema from "./schema";

export async function ensureAdminUsers() {
  const admins = parseAdminEmails();
  if (admins.length === 0) {
    throw new Error("AUTH_ADMIN_EMAILS is required (comma-separated admin emails).");
  }
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is required");

  const db = drizzle(neon(url), { schema });

  let [org] = await db
    .select()
    .from(schema.organizations)
    .where(eq(schema.organizations.slug, "global-call-cop"))
    .limit(1);

  if (!org) {
    [org] = await db
      .insert(schema.organizations)
      .values({
        name: "Global Call COP",
        slug: "global-call-cop",
        description: "COP Youth Policy Implementation — primary organization",
      })
      .returning();
    console.log(`Created organization: ${org.name}`);
  }

  for (const admin of admins) {
    let [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, admin.email))
      .limit(1);

    if (!user) {
      [user] = await db
        .insert(schema.users)
        .values({
          email: admin.email,
          name: admin.name,
          emailVerified: new Date(),
        })
        .returning();
      console.log(`Created user: ${admin.email}`);
    } else {
      console.log(`Found user: ${admin.email}`);
    }

    const [platformRole] = await db
      .select()
      .from(schema.userOrgRoles)
      .where(
        and(
          eq(schema.userOrgRoles.userId, user.id),
          eq(schema.userOrgRoles.role, "platform_admin"),
        ),
      )
      .limit(1);

    if (!platformRole) {
      await db.insert(schema.userOrgRoles).values({
        userId: user.id,
        organizationId: org.id,
        role: "platform_admin",
      });
      console.log(`Assigned platform_admin to ${admin.email}`);
    } else {
      console.log(`platform_admin already assigned to ${admin.email}`);
    }
  }
}

ensureAdminUsers()
  .then(() => {
    console.log("Admin users ensured.");
  })
  .catch((error) => {
    console.error("ensureAdminUsers failed:", error);
    process.exit(1);
  });
