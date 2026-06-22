import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export async function setTenantContext(orgId: string) {
  await db.execute(sql`SELECT set_config('app.current_org_id', ${orgId}, true)`);
}
