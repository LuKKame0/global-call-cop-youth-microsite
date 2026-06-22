import { eq, sql, count, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { submissions, countryGeometries } from "@/lib/db/schema";

export interface CountryMapPoint {
  countryCode: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  submissionCount: number;
}

export async function getSubmissionMapData(orgId: string): Promise<CountryMapPoint[]> {
  const results = await db
    .select({
      countryCode: countryGeometries.countryCode,
      name: countryGeometries.name,
      region: countryGeometries.region,
      lat: countryGeometries.centroidLat,
      lng: countryGeometries.centroidLng,
      submissionCount: count(submissions.id),
    })
    .from(countryGeometries)
    .innerJoin(
      submissions,
      and(
        eq(submissions.countryCode, countryGeometries.countryCode),
        eq(submissions.organizationId, orgId),
      ),
    )
    .groupBy(
      countryGeometries.countryCode,
      countryGeometries.name,
      countryGeometries.region,
      countryGeometries.centroidLat,
      countryGeometries.centroidLng,
    );

  return results
    .filter((r) => r.lat != null && r.lng != null)
    .map((r) => ({
      countryCode: r.countryCode,
      name: r.name,
      region: r.region,
      lat: r.lat!,
      lng: r.lng!,
      submissionCount: r.submissionCount,
    }));
}

export async function getCountryCoverage(orgId: string) {
  const totalCountries = await db
    .select({ count: count() })
    .from(countryGeometries);

  const coveredCountries = await db
    .select({ count: sql<number>`count(distinct ${submissions.countryCode})` })
    .from(submissions)
    .where(eq(submissions.organizationId, orgId));

  return {
    total: totalCountries[0].count,
    covered: coveredCountries[0].count,
    percentage: totalCountries[0].count > 0
      ? Math.round((coveredCountries[0].count / totalCountries[0].count) * 100)
      : 0,
  };
}
