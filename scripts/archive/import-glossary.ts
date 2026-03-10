/**
 * Import glossary terms from CSV into Sanity
 *
 * Run with:
 *   bun run scripts/import-glossary.ts          (dry-run by default)
 *   bun run scripts/import-glossary.ts --write   (actually commit to Sanity)
 */

import { createClient } from "@sanity/client";
import { readFile } from "fs/promises";
import { join } from "path";

// --- CLI Flags ---

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const DRY_RUN = !WRITE;

// --- Sanity Client ---

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!(projectId && dataset && token)) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN"
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

// --- Constants ---

const CSV_PATH = join(process.cwd(), "DATA_IMPORT/design_glossary_complete.csv");
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
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }

  fields.push(current);
  return fields;
}

// --- Main ---

async function main(): Promise<void> {
  console.log("=== Glossary Import: CSV → Sanity ===\n");
  if (DRY_RUN) console.log("*** DRY RUN MODE (pass --write to commit) ***\n");

  const csv = await readFile(CSV_PATH, "utf-8");
  const lines = csv.split("\n").filter((l) => l.trim());

  // Skip header
  const dataLines = lines.slice(1);
  console.log(`Parsed ${dataLines.length} terms from CSV\n`);

  // Build documents
  const docs: { _id: string; _type: "glossary"; name: string; description: string }[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < dataLines.length; i++) {
    const fields = parseCSVLine(dataLines[i]);

    if (fields.length < 3) {
      console.warn(`  Skipping line ${i + 2}: only ${fields.length} fields`);
      continue;
    }

    const [, term, definition] = fields;
    const name = term.trim();
    const description = definition.trim();

    if (!name || !description) {
      console.warn(`  Skipping line ${i + 2}: empty name or description`);
      continue;
    }

    const id = `glossary-${toSlug(name)}`;

    if (seenIds.has(id)) {
      console.warn(`  Duplicate ID "${id}" at line ${i + 2}, skipping`);
      continue;
    }
    seenIds.add(id);

    docs.push({ _id: id, _type: "glossary", name: capitalize(name), description });
  }

  console.log(`${docs.length} documents to import\n`);

  if (DRY_RUN) {
    // Show a sample
    console.log("Sample documents:");
    for (const doc of docs.slice(0, 5)) {
      console.log(`  ${doc._id}: "${doc.name}" — ${doc.description.slice(0, 80)}…`);
    }
    console.log(`  ... and ${docs.length - 5} more\n`);
    console.log("Run with --write to commit to Sanity.");
    return;
  }

  // Batch import using transactions
  let imported = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();

    for (const doc of batch) {
      tx.createOrReplace(doc);
    }

    await tx.commit();
    imported += batch.length;
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${imported}/${docs.length} imported`);
  }

  console.log(`\n=== Done: ${imported} glossary terms imported ===`);

  // Verification
  const total = await client.fetch<number>(`count(*[_type == "glossary"])`);
  console.log(`\nVerification: ${total} glossary documents in Sanity`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
