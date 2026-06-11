import { eq, and, type SQL } from "drizzle-orm";

import { db } from "@/lib/db";
import { organizations, submissions, ragChunks, auditLog } from "@/lib/db/schema";

export async function getOrgBySlug(slug: string) {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1);
  return org ?? null;
}

export async function getOrgById(id: string) {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);
  return org ?? null;
}

export function scopedSubmissions(orgId: string, ...extra: SQL[]) {
  const conditions = [eq(submissions.organizationId, orgId), ...extra];
  return db.select().from(submissions).where(and(...conditions));
}

export function scopedRagChunks(orgId: string, ...extra: SQL[]) {
  const conditions = [eq(ragChunks.organizationId, orgId), ...extra];
  return db.select().from(ragChunks).where(and(...conditions));
}

export async function writeAuditEntry(entry: {
  organizationId?: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  await db.insert(auditLog).values({
    organizationId: entry.organizationId ?? null,
    userId: entry.userId ?? null,
    action: entry.action,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId ?? null,
    details: entry.details ?? {},
    ipAddress: entry.ipAddress ?? null,
  });
}
