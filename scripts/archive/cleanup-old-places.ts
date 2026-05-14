// biome-ignore-all lint: archived one-off data migration script
/**
 * Cleanup script: Remove old city/country documents and leftover fields
 *
 * Run after the place migration has completed:
 *   bun run scripts/cleanup-old-places.ts
 *
 * What it does:
 * 1. Unsets old location/city/country fields from ALL documents (published + drafts)
 * 2. Removes any remaining references to city/country documents
 * 3. Deletes all city and country documents
 * 4. Verifies cleanup is complete
 */

import { createClient } from "@sanity/client";

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

// Use raw perspective to see both published and draft documents
const rawClient = client.withConfig({ perspective: "raw" });

async function main() {
  let _unsetSuccess = 0;
  let unsetErrors = 0;

  // 1a: Unset `location` from designer, institute, professional, bookshop, typeFoundry
  const docsWithLocation: Array<{ _id: string; _type: string }> =
    await rawClient.fetch(
      `*[_type in ["designer", "institute", "professional", "bookshop", "typeFoundry"] && defined(location)]{ _id, _type }`
    );

  for (const doc of docsWithLocation) {
    try {
      await client.patch(doc._id).unset(["location"]).commit();
      _unsetSuccess++;
    } catch {
      unsetErrors++;
    }
  }

  // 1b: Unset `city`, `country` from interview documents
  const interviews: Array<{ _id: string }> = await rawClient.fetch(
    `*[_type == "interview" && (defined(city) || defined(country))]{ _id }`
  );

  for (const doc of interviews) {
    try {
      await client.patch(doc._id).unset(["city", "country"]).commit();
      _unsetSuccess++;
    } catch {
      unsetErrors++;
    }
  }

  // 1c: Unset `locations` from studio documents
  const studios: Array<{ _id: string }> = await rawClient.fetch(
    `*[_type == "studio" && defined(locations)]{ _id }`
  );

  for (const doc of studios) {
    try {
      await client.patch(doc._id).unset(["locations"]).commit();
      _unsetSuccess++;
    } catch {
      unsetErrors++;
    }
  }

  const cityIds: string[] = await rawClient.fetch(`*[_type == "city"]._id`);
  const countryIds: string[] = await rawClient.fetch(
    `*[_type == "country"]._id`
  );

  const allOldIds = [...cityIds, ...countryIds];

  if (allOldIds.length > 0) {
    // Find any documents still referencing these old IDs
    const referencingDocs: Array<{ _id: string; _type: string }> =
      await rawClient.fetch("*[references($ids)]{ _id, _type }", {
        ids: allOldIds,
      });

    for (const doc of referencingDocs) {
      try {
        // Unset all possible old reference fields
        await client
          .patch(doc._id)
          .unset(["location", "city", "country", "locations"])
          .commit();
        _unsetSuccess++;
      } catch {
        unsetErrors++;
      }
    }
  }

  // Re-fetch in case IDs changed
  const remainingCityIds: string[] = await rawClient.fetch(
    `*[_type == "city"]._id`
  );
  const remainingCountryIds: string[] = await rawClient.fetch(
    `*[_type == "country"]._id`
  );

  // Delete one at a time to handle individual failures gracefully
  let _deleteSuccess = 0;
  let deleteErrors = 0;

  for (const id of [...remainingCityIds, ...remainingCountryIds]) {
    try {
      await client.delete(id);
      _deleteSuccess++;
    } catch {
      deleteErrors++;
    }
  }

  const verifyCities = await rawClient.fetch(`count(*[_type == "city"])`);
  const verifyCountries = await rawClient.fetch(`count(*[_type == "country"])`);
  const verifyLocations = await rawClient.fetch(
    `count(*[_type in ["designer", "institute", "professional", "bookshop", "typeFoundry"] && defined(location)])`
  );
  const verifyInterviewFields = await rawClient.fetch(
    `count(*[_type == "interview" && (defined(city) || defined(country))])`
  );
  const verifyStudioLocations = await rawClient.fetch(
    `count(*[_type == "studio" && defined(locations)])`
  );

  const allClean =
    verifyCities === 0 &&
    verifyCountries === 0 &&
    verifyLocations === 0 &&
    verifyInterviewFields === 0 &&
    verifyStudioLocations === 0;
  if (allClean && unsetErrors === 0 && deleteErrors === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((_err) => {
  process.exit(1);
});
