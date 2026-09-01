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

interface TypeFoundryDoc {
  _id: string;
  place: { _ref: string };
}

async function main() {
  const docs: TypeFoundryDoc[] = await rawClient.fetch(
    `*[_type == "typeFoundry" && defined(place)]{ _id, place }`
  );

  if (docs.length === 0) {
    process.exit(0);
  }

  let _success = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      await client
        .patch(doc._id)
        .set({
          places: [
            {
              _key: randomBytes(6).toString("hex"),
              _ref: doc.place._ref,
              _type: "reference",
            },
          ],
        })
        .unset(["place"])
        .commit();
      _success++;
    } catch {
      errors++;
    }
  }

  const remaining = await rawClient.fetch(
    `count(*[_type == "typeFoundry" && defined(place)])`
  );
  const _migrated = await rawClient.fetch(
    `count(*[_type == "typeFoundry" && defined(places)])`
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
