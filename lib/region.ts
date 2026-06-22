import countries from "world-countries";

const normalizeLookup = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const countryLookup = new Map<string, (typeof countries)[number]>();

for (const country of countries) {
  const labels = new Set<string>([
    country.name.common,
    country.name.official,
    country.cca2,
    country.cca3,
    ...(country.altSpellings ?? []),
    ...Object.values(country.translations ?? {}).flatMap((translation) => [
      translation.common,
      translation.official,
    ]),
  ]);

  for (const label of labels) {
    const normalized = normalizeLookup(label);
    if (normalized && !countryLookup.has(normalized)) {
      countryLookup.set(normalized, country);
    }
  }
}

export function deriveRegionFromCountry(countryName: string): string {
  const match = countryLookup.get(normalizeLookup(countryName));

  if (!match) {
    return "Unmapped";
  }

  return match.unRegionalGroup || match.region || "Unmapped";
}
