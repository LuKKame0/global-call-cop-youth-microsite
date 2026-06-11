import { sql } from "drizzle-orm";

import { OrganizationsTable } from "@/components/admin/organizations-table";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";

export default async function AdminOrganizationsPage() {
  const orgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      createdAt: organizations.createdAt,
      submissionCount: sql<number>`(select count(*) from submissions where submissions.organization_id = ${organizations.id})`,
    })
    .from(organizations);

  const rows = orgs.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    createdAt: org.createdAt.toISOString(),
    submissionCount: Number(org.submissionCount),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Organizations
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Click a row to inspect organization fields and settings.
        </p>
      </div>

      <OrganizationsTable rows={rows} />
    </div>
  );
}
