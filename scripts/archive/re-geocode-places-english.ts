/**
 * Migration script: Re-geocode all place documents with English names
 *
 * Run with:
 *   bun run scripts/re-geocode-places-english.ts
 *
 * What it does:
 * 1. Fetches all place documents that have lat and lng
 * 2. Reverse geocodes each using Nominatim with accept-language=en
 * 3. Updates name, city, country, state, formattedAddress with English values
 * 4. Respects Nominatim's 1 req/sec rate limit
 * 5. Logs before/after for each place
 */

import { createClient } from "@sanity/client";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Pittogramma/1.0 (https://pittogramma.com)";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!(projectId && dataset && token)) {
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-12-18",
  useCdn: false,
});

const rawClient = client.withConfig({ perspective: "raw" });

interface PlaceDoc {
  _id: string;
  city: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  name: string;
  state: string;
}

interface NominatimAddress {
  city?: string;
  country?: string;
  country_code?: string;
  municipality?: string;
  state?: string;
  town?: string;
  village?: string;
}

interface NominatimResult {
  address: NominatimAddress;
  display_name: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function reverseGeocode(
  lat: number,
  lng: number
): Promise<NominatimResult> {
  const url = new URL(NOMINATIM_REVERSE_URL);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Nominatim returned ${response.status}: ${response.statusText}`
    );
  }

  return response.json() as Promise<NominatimResult>;
}

async function main() {
  const docs: PlaceDoc[] = await rawClient.fetch(
    `*[_type == "place" && defined(lat) && defined(lng)]{
      _id, name, city, country, countryCode, state, formattedAddress, lat, lng
    } | order(name asc)`
  );

  if (docs.length === 0) {
    process.exit(0);
  }

  let _success = 0;
  let errors = 0;
  let _skipped = 0;

  for (const doc of docs) {
    try {
      // Rate limit: 1 request per second
      await delay(1100);

      const result = await reverseGeocode(doc.lat, doc.lng);
      const addr = result.address;

      const city =
        addr.city || addr.town || addr.village || addr.municipality || "";
      const country = addr.country || "";
      const name =
        city && country
          ? `${city}, ${country}`
          : result.display_name.split(",").slice(0, 2).join(",").trim();
      const state = addr.state || "";
      const formattedAddress = result.display_name;

      // Check if anything actually changed
      const countryCode = addr.country_code?.toUpperCase() || "";

      if (
        doc.name === name &&
        doc.city === city &&
        doc.country === country &&
        doc.countryCode === countryCode &&
        doc.state === state &&
        doc.formattedAddress === formattedAddress
      ) {
        _skipped++;
        continue;
      }

      await client
        .patch(doc._id)
        .set({
          name,
          city,
          country,
          countryCode,
          state,
          formattedAddress,
        })
        .commit();

      _success++;
    } catch (err) {
      process.stderr.write(
        `  ERROR: ${doc._id} "${doc.name}": ${
          err instanceof Error ? err.message : err
        }\n`
      );
      errors++;
    }
  }

  const _total = await rawClient.fetch(
    `count(*[_type == "place" && defined(lat) && defined(lng)])`
  );

  if (errors === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((_err) => {
  process.exit(1);
});
