// biome-ignore-all lint: archived one-off migration script
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
  const typeFilter = TARGET_TYPES.map((t) => `_type == "${t}"`).join(" || ");
  const query = `*[(${typeFilter}) && defined(tagSelector.tags)]{ _id, _type, tagSelector }`;

  const docs: DocWithTagSelector[] = await rawClient.fetch(query);

  if (docs.length === 0) {
    process.exit(0);
  }

  // Group by type for logging
  const byType: Record<string, number> = {};
  for (const doc of docs) {
    byType[doc._type] = (byType[doc._type] || 0) + 1;
  }
  for (const [_type, _count] of Object.entries(byType)) {
  }

  let _success = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      if (DRY_RUN) {
      } else {
        await client
          .patch(doc._id)
          .set({ tags: doc.tagSelector.tags })
          .unset(["tagSelector"])
          .commit();
      }
      _success++;
    } catch {
      errors++;
    }
  }

  if (DRY_RUN) {
    process.exit(0);
  }

  const remaining = await rawClient.fetch<number>(
    `count(*[(${typeFilter}) && defined(tagSelector.tags)])`
  );
  const _migrated = await rawClient.fetch<number>(
    `count(*[(${typeFilter}) && defined(tags)])`
  );

  if (remaining === 0 && errors === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((_err) => {
  process.exit(1);
});
