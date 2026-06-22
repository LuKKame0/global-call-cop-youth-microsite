import { NextResponse } from "next/server";

import { listMarketingLeads } from "@/lib/leads/persist";
import type { DirectoryMember } from "@/lib/i18n/types";

export const revalidate = 300; // 5-minute cache

export async function GET() {
  try {
    const leads = await listMarketingLeads("focal_point", 500);

    const members: DirectoryMember[] = leads
      .filter((lead) => lead.name && lead.country)
      .map((lead) => ({
        id: lead.id,
        name: lead.name,
        country: lead.country ?? "",
        city: (lead.payload as Record<string, unknown>).city as string | undefined,
        linkedin: (lead.payload as Record<string, unknown>).linkedin as string | undefined,
      }));

    return NextResponse.json({ members }, { status: 200 });
  } catch {
    return NextResponse.json({ members: [] }, { status: 200 });
  }
}
