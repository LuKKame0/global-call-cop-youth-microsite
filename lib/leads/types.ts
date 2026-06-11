export const LEAD_TYPES = ["apply", "partner", "coordination", "focal_point"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "declined",
  "archived",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadRecord = {
  id: string;
  type: LeadType;
  status: LeadStatus;
  source?: string;
  ipAddress?: string;
  name: string;
  email?: string;
  organization?: string;
  role?: string;
  country?: string;
  partnershipType?: string;
  intent?: string;
  message?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type LeadSegmentFile = {
  segment: LeadType;
  updatedAt: string;
  records: LeadRecord[];
};
