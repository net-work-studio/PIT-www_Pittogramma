// biome-ignore-all lint: archived one-off migration script
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
  process.exit(1);
}

const client = createClient({
  apiVersion: "2025-12-18",
  dataset,
  projectId,
  token,
  useCdn: false,
});

const rawClient = client.withConfig({ perspective: "raw" });

const VALID_VALUES = ["talk", "workshop", "5+1", "event"] as const;

const TYPE_MAPPING: Record<string, string> = {
  "5+1": "5+1",
  adadad: "workshop",
  Talk: "talk",
  Workshop: "workshop",
};

interface EventDoc {
  _id: string;
  title: string | null;
  type: string | null;
}

async function main() {
  const docs: EventDoc[] = await rawClient.fetch(
    `*[_type == "event" && defined(type)]{ _id, title, type }`
  );

  if (docs.length === 0) {
    process.exit(0);
  }

  let _success = 0;
  let _skipped = 0;
  let errors = 0;

  for (const doc of docs) {
    const currentType = doc.type ?? "";
    const newType = TYPE_MAPPING[currentType];

    if (newType === undefined) {
      errors++;
      continue;
    }

    if (currentType === newType) {
      _skipped++;
      _success++;
      continue;
    }

    try {
      if (DRY_RUN) {
      } else {
        await client.patch(doc._id).set({ type: newType }).commit();
      }
      _success++;
    } catch {
      errors++;
    }
  }

  if (DRY_RUN) {
    process.exit(0);
  }

  const validFilter = VALID_VALUES.map((v) => `type == "${v}"`).join(" || ");
  const invalidCount = await rawClient.fetch<number>(
    `count(*[_type == "event" && defined(type) && !(${validFilter})])`
  );
  const _validCount = await rawClient.fetch<number>(
    `count(*[_type == "event" && defined(type) && (${validFilter})])`
  );

  if (invalidCount === 0 && errors === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((_err) => {
  process.exit(1);
});
