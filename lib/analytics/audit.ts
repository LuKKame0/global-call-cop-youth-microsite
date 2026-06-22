import { eq, desc, and, type SQL } from "drizzle-orm";

import { db } from "@/lib/db";
import { auditLog, users } from "@/lib/db/schema";

export interface AuditEntry {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  details: Record<string, unknown>;
  ipAddress: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
}

export async function getAuditLog(
  orgId: string,
  opts?: { limit?: number; action?: string; resourceType?: string },
): Promise<AuditEntry[]> {
  const limit = opts?.limit ?? 100;
  const conditions: SQL[] = [eq(auditLog.organizationId, orgId)];
  if (opts?.action) conditions.push(eq(auditLog.action, opts.action));
  if (opts?.resourceType) conditions.push(eq(auditLog.resourceType, opts.resourceType));

  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      resourceType: auditLog.resourceType,
      resourceId: auditLog.resourceId,
      details: auditLog.details,
      ipAddress: auditLog.ipAddress,
      createdAt: auditLog.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);

  return rows as AuditEntry[];
}
