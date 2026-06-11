import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import countries from "world-countries";

import * as schema from "./schema";

const REGION_MAP: Record<string, string> = {
  AF: "Africa",
  AN: "Antarctica",
  AS: "Asia-Pacific",
  EU: "Europe",
  NA: "Americas",
  OC: "Asia-Pacific",
  SA: "Americas",
};

async function seedCountries() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log(`Seeding ${countries.length} countries...`);

  const rows = countries.map((c) => ({
    countryCode: c.cca2,
    name: c.name.common,
    region: REGION_MAP[c.region === "" ? "AN" : c.region.slice(0, 2).toUpperCase()] ?? c.region,
    centroidLat: c.latlng?.[0] ?? null,
    centroidLng: c.latlng?.[1] ?? null,
    boundingBox: null,
    metadata: { subregion: c.subregion, cca3: c.cca3 },
  }));

  // Batch insert in chunks of 50
  for (let i = 0; i < rows.length; i += 50) {
    await db
      .insert(schema.countryGeometries)
      .values(rows.slice(i, i + 50))
      .onConflictDoNothing();
  }

  console.log(`Seeded ${rows.length} countries.`);
}

seedCountries().catch((err) => {
  console.error("Country seed failed:", err);
  process.exit(1);
});
