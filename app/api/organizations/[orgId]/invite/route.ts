import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, userOrgRoles, organizations } from "@/lib/db/schema";
import { hasPermission, type OrgRole, type UserRole } from "@/lib/auth/permissions";
import { writeAuditEntry } from "@/lib/tenant/queries";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["org_admin", "regional_coordinator", "country_focal_point", "observer"]),
  region: z.string().optional(),
  countryCode: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId } = await params;
  const roles: OrgRole[] = (session as any).roles ?? [];

  if (!hasPermission(roles, orgId, "users.invite")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { email, role, region, countryCode } = parsed.data;

  // Verify org exists
  const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  // Find or create user
  let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    [user] = await db
      .insert(users)
      .values({ email })
      .returning();
  }

  // Check if role already assigned
  const existingRoles = await db
    .select()
    .from(userOrgRoles)
    .where(eq(userOrgRoles.userId, user.id));

  const alreadyAssigned = existingRoles.some(
    (r) =>
      r.organizationId === orgId &&
      r.role === role &&
      r.region === (region ?? null) &&
      r.countryCode === (countryCode ?? null),
  );

  if (alreadyAssigned) {
    return NextResponse.json({ error: "Role already assigned" }, { status: 409 });
  }

  await db.insert(userOrgRoles).values({
    userId: user.id,
    organizationId: orgId,
    role,
    region: region ?? null,
    countryCode: countryCode ?? null,
  });

  await writeAuditEntry({
    organizationId: orgId,
    userId: session.user.id,
    action: "user.invite",
    resourceType: "user",
    resourceId: user.id,
    details: { email, role, region, countryCode },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
