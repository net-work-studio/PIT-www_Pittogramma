/**
 * Migration script: Normalize event `type` field to lowercase dropdown values
 *
 * Run with:
 *   bun run scripts/migrate-event-type-dropdown.ts
 *   bun run scripts/migrate-event-type-dropdown.ts --dry-run
 *
 * Mapping:
 *   "5+1"      → "5+1"       (no change)
 *   "Talk"     → "talk"      (lowercase)
 *   "Workshop" → "workshop"  (lowercase)
 *   "adadad"   → "workshop"  (garbage → workshop, based on document title)
 *
 * Any value not in the mapping is flagged as an error.
 */

import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!(projectId && dataset && token)) {
  console.error(
    "Missing environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN",
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

const VALID_VALUES = ["talk", "workshop", "5+1", "event"] as const;

const TYPE_MAPPING: Record<string, string> = {
  "5+1": "5+1",
  Talk: "talk",
  Workshop: "workshop",
  adadad: "workshop",
};

interface EventDoc {
  _id: string;
  title: string | null;
  type: string | null;
}

async function main() {
  console.log(
    `=== Migrate event type to dropdown values${DRY_RUN ? " (DRY RUN)" : ""} ===\n`,
  );

  const docs: EventDoc[] = await rawClient.fetch(
    `*[_type == "event" && defined(type)]{ _id, title, type }`,
  );

  console.log(`Found ${docs.length} events with a type field\n`);

  if (docs.length === 0) {
    console.log("Nothing to migrate.");
    process.exit(0);
  }

  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of docs) {
    const currentType = doc.type ?? "";
    const newType = TYPE_MAPPING[currentType];

    if (newType === undefined) {
      console.error(
        `  UNKNOWN VALUE: "${currentType}" on ${doc._id} ("${doc.title}") — no mapping defined`,
      );
      errors++;
      continue;
    }

    if (currentType === newType) {
      console.log(
        `  SKIP: ${doc._id} ("${doc.title}") — already "${currentType}"`,
      );
      skipped++;
      success++;
      continue;
    }

    try {
      if (DRY_RUN) {
        console.log(
          `  [DRY RUN] Would change ${doc._id} ("${doc.title}"): "${currentType}" → "${newType}"`,
        );
      } else {
        await client.patch(doc._id).set({ type: newType }).commit();
        console.log(
          `  OK: ${doc._id} ("${doc.title}"): "${currentType}" → "${newType}"`,
        );
      }
      success++;
    } catch (err) {
      console.error(
        `  ERROR: ${doc._id}: ${err instanceof Error ? err.message : err}`,
      );
      errors++;
    }
  }

  console.log(
    `\nMigration complete: ${success} succeeded (${skipped} already correct), ${errors} errors\n`,
  );

  if (DRY_RUN) {
    console.log("=== Dry run complete. No changes were made. ===");
    process.exit(0);
  }

  // Verify all events now have valid dropdown values
  console.log("Verifying...\n");

  const validFilter = VALID_VALUES.map((v) => `type == "${v}"`).join(" || ");
  const invalidCount = await rawClient.fetch<number>(
    `count(*[_type == "event" && defined(type) && !(${validFilter})])`,
  );
  const validCount = await rawClient.fetch<number>(
    `count(*[_type == "event" && defined(type) && (${validFilter})])`,
  );

  console.log(`  Events with valid dropdown values: ${validCount}`);
  console.log(`  Events with invalid values: ${invalidCount}`);

  if (invalidCount === 0 && errors === 0) {
    console.log("\n=== Migration successful! ===");
    process.exit(0);
  } else {
    console.log(
      "\n=== WARNING: Some documents have invalid values. Check errors above. ===",
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
