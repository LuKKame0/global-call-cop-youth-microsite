import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionRoles } from "@/lib/admin/session-roles";
import { isPlatformAdmin } from "@/lib/auth/permissions";
import {
  getMarketingLeadSegmentExport,
  getMarketingLeadsExportAll,
} from "@/lib/leads/persist";
import { LEAD_TYPES, type LeadType } from "@/lib/leads/types";

export async function GET(request: NextRequest) {
  const { session, roles } = await getSessionRoles();

  if (!session?.user || !isPlatformAdmin(roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const scope = request.nextUrl.searchParams.get("scope");
  if (scope === "all") {
    const payload = await getMarketingLeadsExportAll();
    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="marketing-leads-all.json"',
      },
    });
  }

  const type = request.nextUrl.searchParams.get("type") as LeadType | null;
  if (!type || !LEAD_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid segment type." }, { status: 400 });
  }

  const segment = await getMarketingLeadSegmentExport(type);

  return new NextResponse(JSON.stringify(segment, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-leads.json"`,
    },
  });
}
