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

// Use raw perspective to see both published and draft documents
const rawClient = client.withConfig({ perspective: "raw" });

async function main() {
  console.log("=== Old Places Cleanup Script ===\n");

  // Phase 1: Unset old fields from ALL documents (published + drafts)
  console.log(
    "Phase 1: Unsetting old fields from documents (including drafts)...\n"
  );

  let unsetSuccess = 0;
  let unsetErrors = 0;

  // 1a: Unset `location` from designer, institute, professional, bookshop, typeFoundry
  const docsWithLocation: Array<{ _id: string; _type: string }> =
    await rawClient.fetch(
      `*[_type in ["designer", "institute", "professional", "bookshop", "typeFoundry"] && defined(location)]{ _id, _type }`
    );
  console.log(
    `  Found ${docsWithLocation.length} documents with old "location" field`
  );

  for (const doc of docsWithLocation) {
    try {
      await client.patch(doc._id).unset(["location"]).commit();
      console.log(`  OK: Unset location from ${doc._type} ${doc._id}`);
      unsetSuccess++;
    } catch (err) {
      console.error(
        `  ERROR: ${doc._type} ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      unsetErrors++;
    }
  }

  // 1b: Unset `city`, `country` from interview documents
  const interviews: Array<{ _id: string }> = await rawClient.fetch(
    `*[_type == "interview" && (defined(city) || defined(country))]{ _id }`
  );
  console.log(
    `  Found ${interviews.length} interviews with old "city"/"country" fields`
  );

  for (const doc of interviews) {
    try {
      await client.patch(doc._id).unset(["city", "country"]).commit();
      console.log(`  OK: Unset city/country from interview ${doc._id}`);
      unsetSuccess++;
    } catch (err) {
      console.error(
        `  ERROR: interview ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      unsetErrors++;
    }
  }

  // 1c: Unset `locations` from studio documents
  const studios: Array<{ _id: string }> = await rawClient.fetch(
    `*[_type == "studio" && defined(locations)]{ _id }`
  );
  console.log(`  Found ${studios.length} studios with old "locations" field`);

  for (const doc of studios) {
    try {
      await client.patch(doc._id).unset(["locations"]).commit();
      console.log(`  OK: Unset locations from studio ${doc._id}`);
      unsetSuccess++;
    } catch (err) {
      console.error(
        `  ERROR: studio ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      unsetErrors++;
    }
  }

  console.log(
    `\n  Phase 1 complete: ${unsetSuccess} succeeded, ${unsetErrors} errors\n`
  );

  // Phase 2: Find and clean any remaining references to city/country documents
  console.log(
    "Phase 2: Removing remaining references to city/country documents...\n"
  );

  const cityIds: string[] = await rawClient.fetch(`*[_type == "city"]._id`);
  const countryIds: string[] = await rawClient.fetch(
    `*[_type == "country"]._id`
  );

  const allOldIds = [...cityIds, ...countryIds];
  console.log(
    `  Found ${cityIds.length} city and ${countryIds.length} country documents`
  );

  if (allOldIds.length > 0) {
    // Find any documents still referencing these old IDs
    const referencingDocs: Array<{ _id: string; _type: string }> =
      await rawClient.fetch("*[references($ids)]{ _id, _type }", {
        ids: allOldIds,
      });

    console.log(
      `  Found ${referencingDocs.length} documents still referencing old city/country docs`
    );

    for (const doc of referencingDocs) {
      try {
        // Unset all possible old reference fields
        await client
          .patch(doc._id)
          .unset(["location", "city", "country", "locations"])
          .commit();
        console.log(`  OK: Cleaned references from ${doc._type} ${doc._id}`);
        unsetSuccess++;
      } catch (err) {
        console.error(
          `  ERROR: ${doc._type} ${doc._id}: ${err instanceof Error ? err.message : err}`
        );
        unsetErrors++;
      }
    }
  }

  // Phase 3: Delete all city and country documents
  console.log("\nPhase 3: Deleting old city and country documents...\n");

  // Re-fetch in case IDs changed
  const remainingCityIds: string[] = await rawClient.fetch(
    `*[_type == "city"]._id`
  );
  const remainingCountryIds: string[] = await rawClient.fetch(
    `*[_type == "country"]._id`
  );

  console.log(
    `  Found ${remainingCityIds.length} city documents and ${remainingCountryIds.length} country documents to delete`
  );

  // Delete one at a time to handle individual failures gracefully
  let deleteSuccess = 0;
  let deleteErrors = 0;

  for (const id of [...remainingCityIds, ...remainingCountryIds]) {
    try {
      await client.delete(id);
      console.log(`  OK: Deleted ${id}`);
      deleteSuccess++;
    } catch (err) {
      console.error(
        `  ERROR deleting ${id}: ${err instanceof Error ? err.message : err}`
      );
      deleteErrors++;
    }
  }

  console.log(
    `\n  Phase 3 complete: ${deleteSuccess} deleted, ${deleteErrors} errors\n`
  );

  // Phase 4: Verify cleanup
  console.log("Phase 4: Verifying cleanup...\n");

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

  console.log(`  Remaining city documents: ${verifyCities}`);
  console.log(`  Remaining country documents: ${verifyCountries}`);
  console.log(`  Remaining location fields: ${verifyLocations}`);
  console.log(
    `  Remaining interview city/country fields: ${verifyInterviewFields}`
  );
  console.log(`  Remaining studio locations fields: ${verifyStudioLocations}`);

  console.log("\n=== Cleanup Complete ===");
  if (allClean && unsetErrors === 0 && deleteErrors === 0) {
    console.log("  All old data has been removed successfully!");
    process.exit(0);
  } else {
    console.log("  WARNING: Some old data still remains. Check errors above.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
