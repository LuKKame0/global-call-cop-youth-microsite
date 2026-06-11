import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/config";
import { hasPermission, type OrgRole } from "@/lib/auth/permissions";
import { getOrgById } from "@/lib/tenant/queries";
import { generateSubmissionsCsv } from "@/lib/reports/csv";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, format } = await request.json();
  if (!orgId) {
    return NextResponse.json({ error: "orgId required" }, { status: 400 });
  }

  const roles: OrgRole[] = (session as any).roles ?? [];
  if (!hasPermission(roles, orgId, "reports.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await getOrgById(orgId);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const csv = await generateSubmissionsCsv(org.id);
  const filename = `cop-submissions-${org.slug}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
