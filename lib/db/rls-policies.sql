-- Row-Level Security policies for tenant isolation (defense-in-depth)
-- Run after drizzle-kit push creates the tables.
-- The application sets current_setting('app.current_org_id') per transaction.

-- Enable RLS on tenant-scoped tables
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_queue ENABLE ROW LEVEL SECURITY;

-- Policy: rows visible only when app.current_org_id matches organization_id
-- FORCE means even table owners are subject to the policy
ALTER TABLE submissions FORCE ROW LEVEL SECURITY;
ALTER TABLE rag_chunks FORCE ROW LEVEL SECURITY;
ALTER TABLE embeddings FORCE ROW LEVEL SECURITY;
ALTER TABLE enrichments FORCE ROW LEVEL SECURITY;
ALTER TABLE processing_queue FORCE ROW LEVEL SECURITY;

-- Submissions
CREATE POLICY tenant_isolation_submissions ON submissions
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_insert_submissions ON submissions
  FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- RAG Chunks
CREATE POLICY tenant_isolation_rag_chunks ON rag_chunks
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_insert_rag_chunks ON rag_chunks
  FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Embeddings
CREATE POLICY tenant_isolation_embeddings ON embeddings
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_insert_embeddings ON embeddings
  FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Enrichments
CREATE POLICY tenant_isolation_enrichments ON enrichments
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_insert_enrichments ON enrichments
  FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Processing Queue
CREATE POLICY tenant_isolation_queue ON processing_queue
  USING (organization_id = current_setting('app.current_org_id', true)::uuid);

CREATE POLICY tenant_insert_queue ON processing_queue
  FOR INSERT WITH CHECK (organization_id = current_setting('app.current_org_id', true)::uuid);

-- Audit Log: allow insert from any context, read scoped by org
CREATE POLICY tenant_read_audit ON audit_log
  FOR SELECT USING (
    organization_id = current_setting('app.current_org_id', true)::uuid
    OR organization_id IS NULL
  );

CREATE POLICY tenant_insert_audit ON audit_log
  FOR INSERT WITH CHECK (true);
