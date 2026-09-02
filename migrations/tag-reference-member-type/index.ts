// biome-ignore-all lint: one-off data repair migration
/**
 * Repairs tag reference array members written with `_type: "tag"`.
 *
 * Run:
 *   bunx sanity exec migrations/tag-reference-member-type/index.ts
 *   bunx sanity exec migrations/tag-reference-member-type/index.ts -- --write
 */

import { getCliClient } from "sanity/cli";

const isWrite = process.argv.includes("--write");
const client = getCliClient({
  apiVersion: "2026-06-03",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jfvmcjyl",
  useCdn: false,
});

const TARGET_TYPES = ["studio", "typeFoundry"] as const;
const CHUNK_SIZE = 25;

interface TagReference {
  _key: string;
  _ref: string;
  _type: string;
}

interface DocumentWithInvalidTags {
  _id: string;
  _type: (typeof TARGET_TYPES)[number];
  tags: TagReference[];
}

function invalidTagReferences(tags: TagReference[]): TagReference[] {
  return tags.filter((tag) => tag._type !== "reference");
}

function assertRepairable(tag: TagReference, documentId: string): void {
  if (tag._type !== "tag" || !tag._key || !tag._ref) {
    throw new Error(
      `Refusing to patch unexpected tag item in ${documentId}: ${JSON.stringify(
        {
          _key: tag._key,
          _ref: tag._ref,
          _type: tag._type,
        }
      )}`
    );
  }
}

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
}

async function run() {
  const documents = await client
    .withConfig({ perspective: "raw" })
    .fetch<DocumentWithInvalidTags[]>(
      `*[_type in $types && count(tags[_type != "reference"]) > 0]{
      _id,
      _type,
      tags[]{_key, _ref, _type}
    }`,
      { types: TARGET_TYPES }
    );
  const repairs = documents.flatMap((document) =>
    invalidTagReferences(document.tags).map((tag) => ({ document, tag }))
  );

  for (const { document, tag } of repairs) {
    assertRepairable(tag, document._id);
  }

  process.stdout.write(
    `${isWrite ? "WRITE" : "DRY-RUN"}: ${repairs.length} tag items across ${documents.length} documents.\n`
  );

  if (!isWrite) {
    process.stdout.write("Re-run with --write to apply.\n");
    return;
  }

  for (const batch of chunks(documents, CHUNK_SIZE)) {
    let transaction = client.transaction();

    for (const document of batch) {
      const set: Record<string, "reference"> = {};

      for (const tag of invalidTagReferences(document.tags)) {
        set[`tags[_key == "${tag._key}"]._type`] = "reference";
      }

      transaction = transaction.patch(document._id, { set });
    }

    await transaction.commit();
  }

  const remaining = await client.fetch<number>(
    'count(*[_type in $types && count(tags[_type != "reference"]) > 0])',
    { types: TARGET_TYPES }
  );

  if (remaining !== 0) {
    throw new Error(`${remaining} documents still contain invalid tag items.`);
  }

  process.stdout.write("Validation passed: no invalid tag items remain.\n");
}

run().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Unknown migration failure"}\n`
  );
  process.exit(1);
});
