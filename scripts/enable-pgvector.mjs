import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(url);
await sql`CREATE EXTENSION IF NOT EXISTS vector`;
console.log("pgvector enabled");
