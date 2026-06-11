import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  pgEnum,
  uniqueIndex,
  index,
  vector,
  real,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "platform_admin",
  "org_admin",
  "regional_coordinator",
  "country_focal_point",
  "observer",
]);

export const leadTypeEnum = pgEnum("lead_type", [
  "apply",
  "partner",
  "coordination",
  "focal_point",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "declined",
  "archived",
]);

// ─── Organizations (tenants) ─────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  settings: jsonb("settings").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Users ───────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Auth.js: accounts ──────────────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [uniqueIndex("accounts_provider_unique").on(t.provider, t.providerAccountId)],
);

// ─── Auth.js: verification tokens ──────────────────────────────────

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("verification_tokens_pk").on(t.identifier, t.token)],
);

// ─── Cross-device magic link polling ───────────────────────────────

export const loginPollRequests = pgTable(
  "login_poll_requests",
  {
    pollToken: text("poll_token").primaryKey(),
    email: text("email").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("idx_login_poll_email").on(t.email)],
);

// ─── Credential login throttling ─────────────────────────────────────

export const loginAttempts = pgTable("login_attempts", {
  email: text("email").primaryKey(),
  failedCount: integer("failed_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── RBAC: user ↔ org roles ────────────────────────────────────────

export const userOrgRoles = pgTable(
  "user_org_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    region: text("region"),
    countryCode: text("country_code"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_user_org_roles_user").on(t.userId),
    index("idx_user_org_roles_org").on(t.organizationId),
    uniqueIndex("idx_user_org_roles_unique").on(
      t.userId,
      t.organizationId,
      t.role,
      t.region,
      t.countryCode,
    ),
  ],
);

// ─── Submissions ────────────────────────────────────────────────────

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    userId: uuid("user_id").references(() => users.id),
    countryCode: text("country_code").notNull(),
    region: text("region").notNull(),
    respondentName: text("respondent_name"),
    respondentEmail: text("respondent_email"),
    youthStructure: text("youth_structure"),
    themeResponses: jsonb("theme_responses").notNull(),
    status: text("status").notNull().default("submitted"),
    metadata: jsonb("metadata").notNull().default({}),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_submissions_org").on(t.organizationId),
    index("idx_submissions_country").on(t.countryCode),
    index("idx_submissions_region").on(t.region),
    index("idx_submissions_status").on(t.status),
  ],
);

// ─── RAG Chunks ─────────────────────────────────────────────────────

export const ragChunks = pgTable(
  "rag_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    themeKey: text("theme_key").notNull(),
    fieldKey: text("field_key").notNull(),
    content: text("content").notNull(),
    countryCode: text("country_code").notNull(),
    region: text("region").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_rag_chunks_submission").on(t.submissionId),
    index("idx_rag_chunks_org").on(t.organizationId),
    index("idx_rag_chunks_theme").on(t.themeKey),
  ],
);

// ─── Processing Queue (async jobs: AI enrichment, reports) ─────────

export const processingQueue = pgTable("processing_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  type: text("type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  result: jsonb("result"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});

// ─── Audit Log ──────────────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    userId: uuid("user_id").references(() => users.id),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: uuid("resource_id"),
    details: jsonb("details").notNull().default({}),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_audit_org").on(t.organizationId),
    index("idx_audit_created").on(t.createdAt),
  ],
);

// ─── Embeddings (pgvector) ──────────────────────────────────────────

export const embeddings = pgTable(
  "embeddings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ragChunkId: uuid("rag_chunk_id")
      .notNull()
      .references(() => ragChunks.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    embedding: vector("embedding", { dimensions: 1024 }).notNull(),
    model: text("model").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_embeddings_chunk").on(t.ragChunkId),
    index("idx_embeddings_org").on(t.organizationId),
  ],
);

// ─── AI Enrichments (classification, summaries, etc.) ───────────────

export const enrichments = pgTable(
  "enrichments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    sourceType: text("source_type").notNull(),
    sourceId: uuid("source_id").notNull(),
    enrichmentType: text("enrichment_type").notNull(),
    result: jsonb("result").notNull(),
    model: text("model").notNull(),
    confidence: real("confidence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_enrichments_org").on(t.organizationId),
    index("idx_enrichments_source").on(t.sourceType, t.sourceId),
    index("idx_enrichments_type").on(t.enrichmentType),
  ],
);

// ─── Country Geometries (PostGIS-ready) ─────────────────────────────

export const countryGeometries = pgTable(
  "country_geometries",
  {
    countryCode: text("country_code").primaryKey(),
    name: text("name").notNull(),
    region: text("region").notNull(),
    centroidLat: real("centroid_lat"),
    centroidLng: real("centroid_lng"),
    boundingBox: jsonb("bounding_box"),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (t) => [index("idx_country_geo_region").on(t.region)],
);

// ─── Marketing leads (CRM) ───────────────────────────────────────────

export const marketingLeads = pgTable(
  "marketing_leads",
  {
    id: text("id").primaryKey(),
    type: leadTypeEnum("type").notNull(),
    status: leadStatusEnum("status").notNull().default("new"),
    source: text("source"),
    ipAddress: text("ip_address"),
    name: text("name").notNull(),
    email: text("email"),
    organization: text("organization"),
    role: text("role"),
    country: text("country"),
    partnershipType: text("partnership_type"),
    intent: text("intent"),
    message: text("message"),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_marketing_leads_type").on(t.type),
    index("idx_marketing_leads_status").on(t.status),
    index("idx_marketing_leads_created").on(t.createdAt),
    index("idx_marketing_leads_email").on(t.email),
  ],
);
