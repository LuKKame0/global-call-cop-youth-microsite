import { NextResponse } from "next/server";

import { getSessionRoles } from "@/lib/admin/session-roles";
import { isPlatformAdmin } from "@/lib/auth/permissions";
import { getMarketingLead } from "@/lib/leads/persist";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, roles } = await getSessionRoles();
  if (!session?.user || !isPlatformAdmin(roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const lead = await getMarketingLead(id);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json(lead);
}
