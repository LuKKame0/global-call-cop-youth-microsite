import { NextResponse } from "next/server";

import { getSessionRoles } from "@/lib/admin/session-roles";
import { isPlatformAdmin } from "@/lib/auth/permissions";
import { getOrgById, getOrgBySlug } from "@/lib/tenant/queries";

export async function GET(request: Request) {
  const { session, roles } = await getSessionRoles();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");

  if (!slug && !id) {
    return NextResponse.json({ error: "slug or id parameter required" }, { status: 400 });
  }

  const org = slug ? await getOrgBySlug(slug) : await getOrgById(id!);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const canAccess =
    isPlatformAdmin(roles) ||
    roles.some((role) => role.organizationId === org.id);

  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: org.id,
    name: org.name,
    slug: org.slug,
    description: org.description,
  });
}
