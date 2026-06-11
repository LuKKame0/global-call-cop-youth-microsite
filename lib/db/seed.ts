import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { parseAdminEmails } from "@/lib/env/admin-emails";

import * as schema from "./schema";

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  const admins = parseAdminEmails();
  if (admins.length === 0) {
    throw new Error("AUTH_ADMIN_EMAILS is required (comma-separated admin emails).");
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  const [org] = await db
    .insert(schema.organizations)
    .values({
      name: "Global Call COP",
      slug: "global-call-cop",
      description: "COP Youth Policy Implementation — primary organization",
    })
    .returning();

  console.log(`Created organization: ${org.name} (${org.id})`);

  for (const admin of admins) {
    const [user] = await db
      .insert(schema.users)
      .values({
        email: admin.email,
        name: admin.name,
        emailVerified: new Date(),
      })
      .returning();

    console.log(`Created user: ${user.email} (${user.id})`);

    await db.insert(schema.userOrgRoles).values({
      userId: user.id,
      organizationId: org.id,
      role: "platform_admin",
    });

    console.log(`Assigned platform_admin to ${user.email}`);
  }

  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
