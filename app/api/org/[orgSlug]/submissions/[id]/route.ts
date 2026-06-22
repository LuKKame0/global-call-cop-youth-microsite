import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";

import { getSessionRoles } from "@/lib/admin/session-roles";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { submissions, ragChunks } from "@/lib/db/schema";
import { getOrgBySlug } from "@/lib/tenant/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgSlug: string; id: string }> },
) {
  const { orgSlug, id } = await params;
  const { session, roles } = await getSessionRoles();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrgBySlug(orgSlug);
  if (!org) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  if (!hasPermission(roles, org.id, "submissions.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  if (!submission || submission.organizationId !== org.id) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const [chunkCountRow] = await db
    .select({ count: count() })
    .from(ragChunks)
    .where(eq(ragChunks.submissionId, submission.id));

  return NextResponse.json({
    id: submission.id,
    countryCode: submission.countryCode,
    region: submission.region,
    respondentName: submission.respondentName,
    respondentEmail: submission.respondentEmail,
    youthStructure: submission.youthStructure,
    status: submission.status,
    metadata: (submission.metadata as Record<string, unknown> | null) ?? null,
    themeResponses: (submission.themeResponses as Record<string, Record<string, string>>) ?? {},
    submittedAt: submission.submittedAt?.toISOString() ?? null,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
    ragChunkCount: Number(chunkCountRow?.count ?? 0),
  });
}
