/**
 * Migration script: Convert city/country references to place documents
 *
 * Run after deploying the new schema:
 *   bun run scripts/migrate-places.ts
 *
 * What it does:
 * 1. Queries all documents that reference city/country
 * 2. Groups unique city+country name pairs
 * 3. Geocodes each pair via Nominatim (1 req/sec rate limit)
 * 4. Creates place documents in Sanity
 * 5. Updates all referencing documents to use place references
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!(projectId && dataset && token)) {
  console.error(
    "Missing environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-12-18",
  useCdn: false,
});

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "Pittogramma-Migration/1.0 (https://pittogramma.com)";

interface NominatimResult {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
    state?: string;
  };
  display_name: string;
  lat: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
}

interface CityDoc {
  _id: string;
  name: string;
}

interface CountryDoc {
  _id: string;
  name: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(query: string): Promise<NominatimResult | null> {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.error(`  Nominatim error: ${response.status}`);
    return null;
  }

  const results: NominatimResult[] = await response.json();
  return results[0] || null;
}

async function main() {
  console.log("=== Place Migration Script ===\n");

  // Step 1: Fetch all city and country documents
  console.log("Step 1: Fetching city and country documents...");
  const cities: CityDoc[] = await client.fetch(
    `*[_type == "city"]{ _id, name }`
  );
  const countries: CountryDoc[] = await client.fetch(
    `*[_type == "country"]{ _id, name }`
  );

  const cityMap = new Map(cities.map((c: CityDoc) => [c._id, c.name]));
  const countryMap = new Map(countries.map((c: CountryDoc) => [c._id, c.name]));

  console.log(`  Found ${cities.length} cities, ${countries.length} countries`);

  // Step 2: Fetch all documents that reference cities/countries
  console.log("\nStep 2: Finding documents with location references...");

  // Documents with location object (city + country refs)
  const docsWithLocation = await client.fetch(`
    *[defined(location.city) || defined(location.country)] {
      _id,
      _type,
      "cityId": location.city._ref,
      "countryId": location.country._ref
    }
  `);

  // Interview documents with direct city/country refs
  const interviews = await client.fetch(`
    *[_type == "interview" && (defined(city) || defined(country))] {
      _id,
      _type,
      "cityId": city._ref,
      "countryId": country._ref
    }
  `);

  // Studio documents with locations array
  const studios = await client.fetch(`
    *[_type == "studio" && defined(locations)] {
      _id,
      _type,
      "locationPairs": locations[] {
        "cityId": city._ref,
        "countryId": country._ref
      }
    }
  `);

  console.log(`  ${docsWithLocation.length} documents with location object`);
  console.log(`  ${interviews.length} interviews with city/country`);
  console.log(`  ${studios.length} studios with locations array`);

  // Step 3: Build unique city+country pairs
  console.log("\nStep 3: Building unique location pairs...");

  interface LocationPair {
    cityId: string | null;
    cityName: string;
    countryId: string | null;
    countryName: string;
    key: string;
  }

  const pairsMap = new Map<string, LocationPair>();

  function addPair(cityId: string | null, countryId: string | null) {
    const cityName = cityId ? cityMap.get(cityId) || "" : "";
    const countryName = countryId ? countryMap.get(countryId) || "" : "";
    const key = `${cityName}|${countryName}`;

    if (!pairsMap.has(key) && (cityName || countryName)) {
      pairsMap.set(key, { cityId, countryId, cityName, countryName, key });
    }
  }

  for (const doc of docsWithLocation) {
    addPair(doc.cityId, doc.countryId);
  }
  for (const doc of interviews) {
    addPair(doc.cityId, doc.countryId);
  }
  for (const studio of studios) {
    if (studio.locationPairs) {
      for (const pair of studio.locationPairs) {
        addPair(pair.cityId, pair.countryId);
      }
    }
  }

  const uniquePairs = Array.from(pairsMap.values());
  console.log(`  Found ${uniquePairs.length} unique location pairs`);

  // Step 4: Geocode each pair and create place documents
  console.log("\nStep 4: Geocoding and creating place documents...");

  // Map from "cityName|countryName" -> place document _id
  const placeIdMap = new Map<string, string>();

  for (let i = 0; i < uniquePairs.length; i++) {
    const pair = uniquePairs[i];
    const searchQuery = [pair.cityName, pair.countryName]
      .filter(Boolean)
      .join(", ");

    console.log(
      `  [${i + 1}/${uniquePairs.length}] Geocoding: "${searchQuery}"...`
    );

    const result = await geocode(searchQuery);

    const placeDoc: { _type: string; [key: string]: unknown } = {
      _type: "place",
      name: searchQuery,
      city: pair.cityName,
      country: pair.countryName,
    };

    if (result) {
      const addr = result.address;
      placeDoc.city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        pair.cityName;
      placeDoc.country = addr.country || pair.countryName;
      placeDoc.countryCode = addr.country_code?.toUpperCase() || "";
      placeDoc.state = addr.state || "";
      placeDoc.lat = Number.parseFloat(result.lat);
      placeDoc.lng = Number.parseFloat(result.lon);
      placeDoc.osmId = result.osm_id;
      placeDoc.osmType = result.osm_type;
      placeDoc.formattedAddress = result.display_name;

      const displayName =
        placeDoc.city && placeDoc.country
          ? `${placeDoc.city}, ${placeDoc.country}`
          : searchQuery;
      placeDoc.name = displayName;

      console.log(`    -> Found: ${result.display_name}`);
    } else {
      console.log("    -> Not found, creating with manual data");
    }

    const existing = await client.fetch(
      `*[_type == "place" && city == $city && country == $country][0]._id`,
      { city: placeDoc.city, country: placeDoc.country }
    );
    const placeId = existing || (await client.create(placeDoc))._id;
    if (existing) {
      console.log(`    -> Reusing existing place: ${existing}`);
    }
    placeIdMap.set(pair.key, placeId);

    // Rate limit: 1 request per second
    if (i < uniquePairs.length - 1) {
      await sleep(1100);
    }
  }

  // Step 5: Update referencing documents
  console.log("\nStep 5: Updating document references...");

  let successCount = 0;
  let errorCount = 0;

  // 5a: Documents with location object -> set place, unset location
  for (const doc of docsWithLocation) {
    const cityName = doc.cityId ? cityMap.get(doc.cityId) || "" : "";
    const countryName = doc.countryId
      ? countryMap.get(doc.countryId) || ""
      : "";
    const key = `${cityName}|${countryName}`;
    const placeId = placeIdMap.get(key);

    if (!placeId) {
      console.log(`  SKIP: No place found for ${doc._type} ${doc._id}`);
      errorCount++;
      continue;
    }

    try {
      await client
        .patch(doc._id)
        .set({
          place: { _type: "reference", _ref: placeId },
        })
        .commit();
      console.log(`  OK: ${doc._type} ${doc._id} -> place ${placeId}`);
      successCount++;
    } catch (err) {
      console.error(
        `  ERROR: ${doc._type} ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      errorCount++;
    }
  }

  // 5b: Interviews with direct city/country -> set place, unset city/country
  for (const doc of interviews) {
    const cityName = doc.cityId ? cityMap.get(doc.cityId) || "" : "";
    const countryName = doc.countryId
      ? countryMap.get(doc.countryId) || ""
      : "";
    const key = `${cityName}|${countryName}`;
    const placeId = placeIdMap.get(key);

    if (!placeId) {
      console.log(`  SKIP: No place found for interview ${doc._id}`);
      errorCount++;
      continue;
    }

    try {
      await client
        .patch(doc._id)
        .set({
          place: { _type: "reference", _ref: placeId },
        })
        .commit();
      console.log(`  OK: interview ${doc._id} -> place ${placeId}`);
      successCount++;
    } catch (err) {
      console.error(
        `  ERROR: interview ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      errorCount++;
    }
  }

  // 5c: Studios with locations array -> set places array, unset locations
  for (const studio of studios) {
    if (!studio.locationPairs?.length) {
      continue;
    }

    const placeRefs: Array<{ _type: string; _ref: string; _key: string }> = [];

    for (const pair of studio.locationPairs) {
      const cityName = pair.cityId ? cityMap.get(pair.cityId) || "" : "";
      const countryName = pair.countryId
        ? countryMap.get(pair.countryId) || ""
        : "";
      const key = `${cityName}|${countryName}`;
      const placeId = placeIdMap.get(key);

      if (placeId) {
        placeRefs.push({
          _type: "reference",
          _ref: placeId,
          _key: crypto.randomUUID().slice(0, 12),
        });
      }
    }

    try {
      await client
        .patch(studio._id)
        .set({ places: placeRefs })
        .commit();
      console.log(`  OK: studio ${studio._id} -> ${placeRefs.length} place(s)`);
      successCount++;
    } catch (err) {
      console.error(
        `  ERROR: studio ${studio._id}: ${err instanceof Error ? err.message : err}`
      );
      errorCount++;
    }
  }

  console.log("\n=== Migration Complete ===");
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors:  ${errorCount}`);
  console.log(`  Places created: ${placeIdMap.size}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
