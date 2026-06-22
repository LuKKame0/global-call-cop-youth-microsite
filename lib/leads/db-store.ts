import "server-only";

import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { marketingLeads } from "@/lib/db/schema";
import type { LeadRecord, LeadStatus, LeadType } from "@/lib/leads/types";

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function rowToLead(row: typeof marketingLeads.$inferSelect): LeadRecord {
  return {
    id: row.id,
    type: row.type as LeadType,
    status: row.status as LeadStatus,
    source: row.source ?? undefined,
    ipAddress: row.ipAddress ?? undefined,
    name: row.name,
    email: row.email ?? undefined,
    organization: row.organization ?? undefined,
    role: row.role ?? undefined,
    country: row.country ?? undefined,
    partnershipType: row.partnershipType ?? undefined,
    intent: row.intent ?? undefined,
    message: row.message ?? undefined,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function persistLeadToDatabase(record: LeadRecord) {
  if (!hasDatabase()) {
    return null;
  }

  const [row] = await getDb()
    .insert(marketingLeads)
    .values({
      id: record.id,
      type: record.type,
      status: record.status,
      source: record.source,
      ipAddress: record.ipAddress,
      name: record.name,
      email: record.email,
      organization: record.organization,
      role: record.role,
      country: record.country,
      partnershipType: record.partnershipType,
      intent: record.intent,
      message: record.message,
      payload: record.payload,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    })
    .returning();

  return rowToLead(row);
}

export async function listLeadsFromDatabase(type?: LeadType, limit = 200) {
  if (!hasDatabase()) {
    return [];
  }

  const base = getDb().select().from(marketingLeads);

  const rows = type
    ? await base
        .where(eq(marketingLeads.type, type))
        .orderBy(desc(marketingLeads.createdAt))
        .limit(limit)
    : await base.orderBy(desc(marketingLeads.createdAt)).limit(limit);

  return rows.map(rowToLead);
}

export async function getLeadFromDatabase(id: string) {
  if (!hasDatabase()) {
    return null;
  }

  const [row] = await getDb()
    .select()
    .from(marketingLeads)
    .where(eq(marketingLeads.id, id))
    .limit(1);

  return row ? rowToLead(row) : null;
}

export async function updateLeadInDatabase(id: string, status: LeadStatus) {
  if (!hasDatabase()) {
    return null;
  }

  const [row] = await getDb()
    .update(marketingLeads)
    .set({ status, updatedAt: new Date() })
    .where(eq(marketingLeads.id, id))
    .returning();

  return row ? rowToLead(row) : null;
}
