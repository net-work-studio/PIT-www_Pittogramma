/**
 * Patch SEO meta descriptions for all 111 project documents in Sanity.
 *
 * Run with:
 *   bun run scripts/patch-seo-descriptions.ts
 *   bun run scripts/patch-seo-descriptions.ts --dry-run
 *   bun run scripts/patch-seo-descriptions.ts --only=1_iconocracy
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";

// --- CLI Flags ---

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];

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
  console.log("=== Patch SEO Meta Descriptions ===\n");

  const entries = Object.entries(descriptions);
  const toProcess = ONLY
    ? entries.filter(([folder]) => folder === ONLY)
    : entries;

  if (toProcess.length === 0) {
    console.error(`No matching entries${ONLY ? ` for --only=${ONLY}` : ""}`);
    process.exit(1);
  }

  console.log(`Descriptions to patch: ${toProcess.length}`);
  if (DRY_RUN) console.log("[DRY RUN MODE]\n");
  else console.log();

  let success = 0;
  let errors = 0;
  let over160 = 0;

  for (const [folderName, description] of toProcess) {
    const docId = `project-${folderName}`;
    const len = description.length;

    if (len > 160) {
      console.warn(`  WARNING: ${folderName} is ${len} chars (max 160)`);
      over160++;
    }

    if (DRY_RUN) {
      console.log(`  [DRY RUN] ${docId} (${len} chars)`);
      console.log(`            "${description}"`);
      success++;
      continue;
    }

    try {
      await client
        .patch(docId)
        .setIfMissing({ seo: { _type: "seoModule" } })
        .set({ "seo.metaDescription": description })
        .commit();

      console.log(`  OK: ${docId} (${len} chars)`);
      success++;
    } catch (err) {
      console.error(
        `  ERROR: ${docId}: ${err instanceof Error ? err.message : err}`
      );
      errors++;
    }
  }

  console.log(
    `\nPatch complete: ${success} succeeded, ${errors} errors, ${over160} over 160 chars\n`
  );

  // Verify
  if (!DRY_RUN) {
    console.log("Verifying...\n");

    const withMetaDesc = await rawClient.fetch<number>(
      `count(*[_type == "project" && defined(seo.metaDescription)])`
    );
    const totalProjects = await rawClient.fetch<number>(
      `count(*[_type == "project"])`
    );
    const overLimit = await rawClient.fetch<number>(
      `count(*[_type == "project" && defined(seo.metaDescription) && length(seo.metaDescription) > 160])`
    );

    console.log(
      `  Projects with seo.metaDescription: ${withMetaDesc}/${totalProjects}`
    );
    console.log(`  Descriptions over 160 chars: ${overLimit}`);

    if (withMetaDesc === totalProjects && overLimit === 0) {
      console.log("\n=== All projects patched successfully! ===");
    } else {
      console.log("\n=== Some projects may need attention. Check above. ===");
    }
  }
}

main().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});
