import "server-only";

import { nanoid } from "nanoid";

import {
  getLeadFromDatabase,
  listLeadsFromDatabase,
  persistLeadToDatabase,
  updateLeadInDatabase,
} from "@/lib/leads/db-store";
import {
  appendLeadToJsonSegment,
  exportJsonSegment,
  getLeadFromJsonSegment,
  listLeadsFromJsonSegment,
  updateLeadInJsonSegment,
} from "@/lib/leads/json-store";
import type {
  ApplyFormPayload,
  CoordinationFormPayload,
  FocalPointFormPayload,
  PartnerFormPayload,
} from "@/lib/forms/marketing-schemas";
import type { LeadRecord, LeadStatus, LeadType } from "@/lib/leads/types";

function mergeLeadRecords(dbRows: LeadRecord[], jsonRows: LeadRecord[]) {
  const merged = new Map<string, LeadRecord>();
  for (const row of jsonRows) {
    merged.set(row.id, row);
  }
  for (const row of dbRows) {
    merged.set(row.id, row);
  }
  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

type PersistLeadInput = {
  type: LeadType;
  payload:
    | ApplyFormPayload
    | PartnerFormPayload
    | CoordinationFormPayload
    | FocalPointFormPayload;
  source?: string;
  ipAddress?: string;
};

function normalizeLeadFields(
  type: LeadType,
  payload: Record<string, unknown>,
): Omit<
  LeadRecord,
  "id" | "type" | "status" | "payload" | "createdAt" | "updatedAt" | "source" | "ipAddress"
> {
  if (type === "focal_point") {
    const firstName = String(payload.firstName ?? "");
    const lastName = String(payload.lastName ?? "");
    return {
      name: `${firstName} ${lastName}`.trim(),
      country: String(payload.country ?? "") || undefined,
      intent: String(payload.hostZCop ?? "") || undefined,
    };
  }

  return {
    name: String(payload.name ?? ""),
    email: String(payload.email ?? "") || undefined,
    organization: String(payload.organization ?? "") || undefined,
    role: String(payload.role ?? "") || undefined,
    country: String(payload.country ?? "") || undefined,
    partnershipType:
      type === "partner" ? String(payload.partnershipType ?? "") || undefined : undefined,
    intent: String(payload.intent ?? "") || undefined,
    message: type === "partner" ? String(payload.message ?? "") || undefined : undefined,
  };
}

export async function persistMarketingLead(input: PersistLeadInput) {
  const now = new Date().toISOString();
  const record: LeadRecord = {
    id: nanoid(12),
    type: input.type,
    status: "new",
    source: input.source,
    ipAddress: input.ipAddress,
    ...normalizeLeadFields(input.type, input.payload as Record<string, unknown>),
    payload: input.payload as Record<string, unknown>,
    createdAt: now,
    updatedAt: now,
  };

  await appendLeadToJsonSegment(record);

  try {
    await persistLeadToDatabase(record);
  } catch (error) {
    console.warn("[leads] database persist failed, JSON segment stored", {
      id: record.id,
      type: record.type,
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  return record;
}

export async function listMarketingLeads(type?: LeadType, limit = 200) {
  const [dbRows, jsonRows] = await Promise.all([
    listLeadsFromDatabase(type, limit),
    listLeadsFromJsonSegment(type, limit),
  ]);

  if (dbRows.length === 0 && jsonRows.length === 0) {
    return [];
  }

  return mergeLeadRecords(dbRows, jsonRows).slice(0, limit);
}

export async function getMarketingLead(id: string) {
  const dbLead = await getLeadFromDatabase(id);
  if (dbLead) {
    return dbLead;
  }
  return getLeadFromJsonSegment(id);
}

export async function updateMarketingLeadStatus(id: string, status: LeadStatus) {
  const jsonLead = await updateLeadInJsonSegment(id, { status });
  try {
    const dbLead = await updateLeadInDatabase(id, status);
    return dbLead ?? jsonLead;
  } catch (error) {
    console.warn("[leads] database status update failed", {
      id,
      error: error instanceof Error ? error.message : "unknown",
    });
    return jsonLead;
  }
}

export async function getMarketingLeadSegmentExport(type: LeadType) {
  const [dbRows, jsonSegment] = await Promise.all([
    listLeadsFromDatabase(type, 1000),
    exportJsonSegment(type),
  ]);

  return {
    segment: type,
    updatedAt: new Date().toISOString(),
    records: mergeLeadRecords(dbRows, jsonSegment.records),
  };
}

export async function getMarketingLeadsExportAll() {
  const segments = await Promise.all(
    (["apply", "partner", "coordination", "focal_point"] as const).map((type) =>
      getMarketingLeadSegmentExport(type),
    ),
  );

  return {
    exportedAt: new Date().toISOString(),
    segments,
  };
}
