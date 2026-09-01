// biome-ignore-all lint: archived one-off import script
/**
 * Import glossary terms from CSV into Sanity
 *
 * Run with:
 *   bun run scripts/import-glossary.ts          (dry-run by default)
 *   bun run scripts/import-glossary.ts --write   (actually commit to Sanity)
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@sanity/client";

// --- CLI Flags ---

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const DRY_RUN = !WRITE;

// --- Sanity Client ---

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

// --- Constants ---

const CSV_PATH = join(
  process.cwd(),
  "DATA_IMPORT/design_glossary_complete.csv"
);
const BATCH_SIZE = 100;

// --- Helpers ---

function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function capitalize(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Parse a single CSV line respecting quoted fields */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

// --- Main ---

async function main(): Promise<void> {
  if (DRY_RUN) {
  }

  const csv = await readFile(CSV_PATH, "utf-8");
  const lines = csv.split("\n").filter((l) => l.trim());

  // Skip header
  const dataLines = lines.slice(1);

  // Build documents
  const docs: {
    _id: string;
    _type: "glossary";
    name: string;
    description: string;
  }[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < dataLines.length; i++) {
    const fields = parseCSVLine(dataLines[i]);

    if (fields.length < 3) {
      continue;
    }

    const [, term, definition] = fields;
    const name = term.trim();
    const description = definition.trim();

    if (!(name && description)) {
      continue;
    }

    const id = `glossary-${toSlug(name)}`;

    if (seenIds.has(id)) {
      continue;
    }
    seenIds.add(id);

    docs.push({
      _id: id,
      _type: "glossary",
      description,
      name: capitalize(name),
    });
  }

  if (DRY_RUN) {
    for (const _doc of docs.slice(0, 5)) {
    }
    return;
  }

  // Batch import using transactions
  let _imported = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();

    for (const doc of batch) {
      tx.createOrReplace(doc);
    }

    await tx.commit();
    _imported += batch.length;
  }
}

main().catch((_err) => {
  process.exit(1);
});
