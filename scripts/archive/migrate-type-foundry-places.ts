/**
 * Migration script: Move typeFoundry `place` (single ref) → `places[]` (array of refs)
 *
 * Run with:
 *   bun run scripts/migrate-type-foundry-places.ts
 *
 * What it does:
 * 1. Fetches all typeFoundry documents that still have the old `place` field
 * 2. Copies the reference into the new `places[]` array
 * 3. Unsets the old `place` field
 * 4. Verifies migration is complete
 */

import { randomBytes } from "node:crypto";
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

const rawClient = client.withConfig({ perspective: "raw" });

interface TypeFoundryDoc {
  _id: string;
  place: { _ref: string };
}

async function main() {
  console.log("=== TypeFoundry place → places[] Migration ===\n");

  const docs: TypeFoundryDoc[] = await rawClient.fetch(
    `*[_type == "typeFoundry" && defined(place)]{ _id, place }`
  );

  console.log(
    `Found ${docs.length} typeFoundry documents with old "place" field\n`
  );

  if (docs.length === 0) {
    console.log("Nothing to migrate.");
    process.exit(0);
  }

  let success = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      await client
        .patch(doc._id)
        .set({
          places: [
            {
              _type: "reference",
              _ref: doc.place._ref,
              _key: randomBytes(6).toString("hex"),
            },
          ],
        })
        .unset(["place"])
        .commit();

      console.log(`  OK: Migrated ${doc._id} (place ref: ${doc.place._ref})`);
      success++;
    } catch (err) {
      console.error(
        `  ERROR: ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      errors++;
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${errors} errors\n`);

  // Verify
  console.log("Verifying...\n");

  const remaining = await rawClient.fetch(
    `count(*[_type == "typeFoundry" && defined(place)])`
  );
  const migrated = await rawClient.fetch(
    `count(*[_type == "typeFoundry" && defined(places)])`
  );

  console.log(`  Documents still with old "place" field: ${remaining}`);
  console.log(`  Documents with new "places[]" array: ${migrated}`);

  if (remaining === 0 && errors === 0) {
    console.log("\n=== Migration successful! ===");
    process.exit(0);
  } else {
    console.log(
      "\n=== WARNING: Some documents were not migrated. Check errors above. ==="
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
