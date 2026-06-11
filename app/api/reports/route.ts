import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/config";
import { hasPermission, type OrgRole } from "@/lib/auth/permissions";
import { getOrgById } from "@/lib/tenant/queries";
import { generateReport, type ReportScope } from "@/lib/reports/generator";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, scopeType, scopeValue } = await request.json();
  if (!orgId) {
    return NextResponse.json({ error: "orgId required" }, { status: 400 });
  }

  const roles: OrgRole[] = (session as any).roles ?? [];
  if (!hasPermission(roles, orgId, "reports.generate")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await getOrgById(orgId);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const scope: ReportScope =
    scopeType === "region" && scopeValue
      ? { type: "region", region: scopeValue }
      : scopeType === "country" && scopeValue
        ? { type: "country", countryCode: scopeValue }
        : { type: "org" };

  const report = await generateReport(org.id, org.name, scope);

  return NextResponse.json(report);
}
