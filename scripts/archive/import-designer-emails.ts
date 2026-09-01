// biome-ignore-all lint: archived one-off import script
/**
 * Import designer emails from Kirby data into Sanity
 *
 * Run with:
 *   bun run scripts/import-designer-emails.ts          (dry-run by default)
 *   bun run scripts/import-designer-emails.ts --write   (actually commit to Sanity)
 */

import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { Glob } from "bun";

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

// --- Helpers ---

function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseKirbyFile(content: string): Record<string, string> {
  const blocks = content.split(/\n\n----\n\n/);
  const fields: Record<string, string> = {};

  for (const block of blocks) {
    const match = block.match(/^(\w+):\s*([\s\S]*)$/);
    if (match) {
      fields[match[1]] = match[2].trim();
    }
  }

  return fields;
}

function parseInfoBlock(info: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of info.split("\n")) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      result[match[1]] = match[2].trim();
    }
  }

  return result;
}

// --- Main ---

async function main(): Promise<void> {
  if (DRY_RUN) {
  }

  // 1. Scan Kirby files
  const g = new Glob("DATA_IMPORT/2_designers/*/designer.en.txt");
  const files = Array.from(g.scanSync("."));

  // 2. Parse emails from Kirby data
  const designerEmails: { name: string; slug: string; email: string }[] = [];

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const fields = parseKirbyFile(content);

    const name = fields.Title;
    if (!name) {
      continue;
    }

    const info = parseInfoBlock(fields.Info || "");
    const email = info.email;
    if (!email || email === '""') {
      continue;
    }

    designerEmails.push({ email, name, slug: toSlug(name) });
  }

  // 3. Fetch existing person documents from Sanity
  const persons = await client.fetch<
    { _id: string; name: string; slug: { current: string } }[]
  >(`*[_type == "person" && "designer" in roles]{_id, name, slug}`);

  const personBySlug = new Map(persons.map((p) => [p.slug.current, p]));

  // 4. Match and prepare patches
  let _matched = 0;
  let _skipped = 0;
  const patches: { id: string; name: string; email: string }[] = [];

  for (const designer of designerEmails) {
    const person = personBySlug.get(designer.slug);

    if (!person) {
      _skipped++;
      continue;
    }

    patches.push({
      email: designer.email,
      id: person._id,
      name: designer.name,
    });
    _matched++;
  }

  if (patches.length === 0) {
    return;
  }

  if (DRY_RUN) {
    for (const _p of patches) {
    }
    return;
  }

  // 5. Apply patches
  const tx = client.transaction();

  for (const p of patches) {
    tx.patch(p.id, (patch) => patch.set({ email: p.email }));
  }

  await tx.commit();
}

main().catch((_err) => {
  process.exit(1);
});
