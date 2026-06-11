import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth/config";
import { hasPermission, type OrgRole } from "@/lib/auth/permissions";
import { semanticSearch } from "@/lib/ai/semantic-search";

const searchSchema = z.object({
  query: z.string().min(3).max(500),
  orgId: z.string().uuid(),
  themeFilter: z.string().optional(),
  regionFilter: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = searchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { query, orgId, themeFilter, regionFilter, limit } = parsed.data;
  const roles: OrgRole[] = (session as any).roles ?? [];

  if (!hasPermission(roles, orgId, "submissions.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const results = await semanticSearch(query, orgId, {
    themeFilter,
    regionFilter,
    limit,
  });

  return NextResponse.json({ results, count: results.length });
}
