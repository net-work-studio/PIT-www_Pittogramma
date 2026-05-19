// biome-ignore-all lint: archived one-off patch script
/**
 * Patch SEO meta descriptions for all 111 project documents in Sanity.
 *
 * Run with:
 *   bun run scripts/patch-seo-descriptions.ts
 *   bun run scripts/patch-seo-descriptions.ts --dry-run
 *   bun run scripts/patch-seo-descriptions.ts --only=1_iconocracy
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

// --- CLI Flags ---

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];

// --- Sanity Client ---

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

// --- Load descriptions ---

const descriptionsPath = join(
  process.cwd(),
  "scripts/data/seo-descriptions.json"
);
const descriptions: Record<string, string> = JSON.parse(
  readFileSync(descriptionsPath, "utf-8")
);

async function main() {
  const entries = Object.entries(descriptions);
  const toProcess = ONLY
    ? entries.filter(([folder]) => folder === ONLY)
    : entries;

  if (toProcess.length === 0) {
    process.exit(1);
  }
  if (DRY_RUN) {
  } else {
  }

  let _success = 0;
  let _errors = 0;
  let _over160 = 0;

  for (const [folderName, description] of toProcess) {
    const docId = `project-${folderName}`;
    const len = description.length;

    if (len > 160) {
      _over160++;
    }

    if (DRY_RUN) {
      _success++;
      continue;
    }

    try {
      await client
        .patch(docId)
        .setIfMissing({ seo: { _type: "seoModule" } })
        .set({ "seo.metaDescription": description })
        .commit();
      _success++;
    } catch {
      _errors++;
    }
  }

  // Verify
  if (!DRY_RUN) {
    const withMetaDesc = await rawClient.fetch<number>(
      `count(*[_type == "project" && defined(seo.metaDescription)])`
    );
    const totalProjects = await rawClient.fetch<number>(
      `count(*[_type == "project"])`
    );
    const overLimit = await rawClient.fetch<number>(
      `count(*[_type == "project" && defined(seo.metaDescription) && length(seo.metaDescription) > 160])`
    );

    if (withMetaDesc === totalProjects && overLimit === 0) {
    } else {
    }
  }
}

main().catch((_err) => {
  process.exit(1);
});
