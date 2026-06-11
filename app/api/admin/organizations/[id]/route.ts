import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";

import { getSessionRoles } from "@/lib/admin/session-roles";
import { isPlatformAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { organizations, submissions } from "@/lib/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, roles } = await getSessionRoles();
  if (!session?.user || !isPlatformAdmin(roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);

  if (!organization) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  const [submissionCountRow] = await db
    .select({ count: count() })
    .from(submissions)
    .where(eq(submissions.organizationId, organization.id));

  return NextResponse.json({
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    description: organization.description,
    logoUrl: organization.logoUrl,
    settings: (organization.settings as Record<string, unknown>) ?? {},
    submissionCount: Number(submissionCountRow?.count ?? 0),
    createdAt: organization.createdAt.toISOString(),
    updatedAt: organization.updatedAt.toISOString(),
  });
}
