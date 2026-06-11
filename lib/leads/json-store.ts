import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { LeadRecord, LeadSegmentFile, LeadType } from "@/lib/leads/types";

const memorySegments: Record<LeadType, LeadRecord[]> = {
  apply: [],
  partner: [],
  coordination: [],
  focal_point: [],
};

function segmentPath(type: LeadType) {
  return join(process.cwd(), "data", "leads", `${type}.json`);
}

async function readSegment(type: LeadType): Promise<LeadSegmentFile> {
  if (process.env.VERCEL) {
    return {
      segment: type,
      updatedAt: new Date().toISOString(),
      records: [...memorySegments[type]],
    };
  }

  try {
    const raw = await readFile(segmentPath(type), "utf8");
    const parsed = JSON.parse(raw) as LeadSegmentFile;
    return {
      segment: type,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      records: Array.isArray(parsed.records) ? parsed.records : [],
    };
  } catch {
    return {
      segment: type,
      updatedAt: new Date().toISOString(),
      records: [],
    };
  }
}

async function writeSegment(type: LeadType, records: LeadRecord[]) {
  const payload: LeadSegmentFile = {
    segment: type,
    updatedAt: new Date().toISOString(),
    records,
  };

  if (process.env.VERCEL) {
    memorySegments[type] = records;
    console.info("[leads] stored segment in memory", {
      type,
      count: records.length,
    });
    return;
  }

  const dir = join(process.cwd(), "data", "leads");
  await mkdir(dir, { recursive: true });
  await writeFile(segmentPath(type), JSON.stringify(payload, null, 2), "utf8");
  console.info("[leads] stored segment on disk", { type, count: records.length });
}

export async function appendLeadToJsonSegment(record: LeadRecord) {
  const segment = await readSegment(record.type);
  segment.records.unshift(record);
  await writeSegment(record.type, segment.records);
}

export async function listLeadsFromJsonSegment(
  type?: LeadType,
  limit = 200,
): Promise<LeadRecord[]> {
  const types: LeadType[] = type
    ? [type]
    : ["apply", "partner", "coordination", "focal_point"];
  const rows: LeadRecord[] = [];

  for (const segmentType of types) {
    const segment = await readSegment(segmentType);
    rows.push(...segment.records);
  }

  return rows
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getLeadFromJsonSegment(id: string) {
  for (const type of ["apply", "partner", "coordination", "focal_point"] as const) {
    const segment = await readSegment(type);
    const match = segment.records.find((record) => record.id === id);
    if (match) {
      return match;
    }
  }
  return null;
}

export async function updateLeadInJsonSegment(
  id: string,
  patch: Partial<Pick<LeadRecord, "status">>,
) {
  for (const type of ["apply", "partner", "coordination", "focal_point"] as const) {
    const segment = await readSegment(type);
    const index = segment.records.findIndex((record) => record.id === id);
    if (index === -1) {
      continue;
    }

    segment.records[index] = {
      ...segment.records[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    await writeSegment(type, segment.records);
    return segment.records[index];
  }

  return null;
}

export async function exportJsonSegment(type: LeadType) {
  return readSegment(type);
}
