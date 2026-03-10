/**
 * Migration script: Flatten tagSelector.tags → tags for all document types
 *
 * Run with:
 *   bun run scripts/migrate-tag-selector-flatten.ts
 *   bun run scripts/migrate-tag-selector-flatten.ts --dry-run
 *
 * What it does:
 * 1. Fetches all documents that have the old `tagSelector.tags` field
 * 2. Copies `tagSelector.tags` → `tags` (top-level)
 * 3. Unsets the old `tagSelector` field
 * 4. Verifies migration is complete
 */

import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

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

const TARGET_TYPES = [
  "project",
  "interview",
  "journal",
  "studio",
  "event",
  "bibliography",
  "webSource",
  "typeFoundry",
  "bookshop",
];

interface DocWithTagSelector {
  _id: string;
  _type: string;
  tagSelector: {
    tags: Array<{ _key: string; _ref: string; _type: string }>;
  };
}

async function main() {
  console.log(
    `=== Flatten tagSelector.tags → tags Migration${DRY_RUN ? " (DRY RUN)" : ""} ===\n`
  );

  const typeFilter = TARGET_TYPES.map((t) => `_type == "${t}"`).join(" || ");
  const query = `*[(${typeFilter}) && defined(tagSelector.tags)]{ _id, _type, tagSelector }`;

  const docs: DocWithTagSelector[] = await rawClient.fetch(query);

  console.log(
    `Found ${docs.length} documents with old "tagSelector.tags" field\n`
  );

  if (docs.length === 0) {
    console.log("Nothing to migrate.");
    process.exit(0);
  }

  // Group by type for logging
  const byType: Record<string, number> = {};
  for (const doc of docs) {
    byType[doc._type] = (byType[doc._type] || 0) + 1;
  }
  console.log("By type:");
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log();

  let success = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      if (DRY_RUN) {
        console.log(
          `  [DRY RUN] Would migrate ${doc._id} (${doc._type}, ${doc.tagSelector.tags.length} tags)`
        );
      } else {
        await client
          .patch(doc._id)
          .set({ tags: doc.tagSelector.tags })
          .unset(["tagSelector"])
          .commit();

        console.log(
          `  OK: ${doc._id} (${doc._type}, ${doc.tagSelector.tags.length} tags)`
        );
      }
      success++;
    } catch (err) {
      console.error(
        `  ERROR: ${doc._id}: ${err instanceof Error ? err.message : err}`
      );
      errors++;
    }
  }

  console.log(
    `\nMigration complete: ${success} succeeded, ${errors} errors\n`
  );

  if (DRY_RUN) {
    console.log("=== Dry run complete. No changes were made. ===");
    process.exit(0);
  }

  // Verify
  console.log("Verifying...\n");

  const remaining = await rawClient.fetch<number>(
    `count(*[(${typeFilter}) && defined(tagSelector.tags)])`
  );
  const migrated = await rawClient.fetch<number>(
    `count(*[(${typeFilter}) && defined(tags)])`
  );

  console.log(`  Documents still with old "tagSelector.tags": ${remaining}`);
  console.log(`  Documents with new "tags[]" array: ${migrated}`);

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
