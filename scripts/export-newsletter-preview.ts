// biome-ignore-all lint: CLI utility script
/**
 * Export newsletter preview blocks from Sanity for Brevo campaign assembly.
 *
 * Run with:
 *   bun run scripts/export-newsletter-preview.ts
 *   bun run scripts/export-newsletter-preview.ts --limit=5
 *   bun run scripts/export-newsletter-preview.ts --output=./tmp/newsletter-preview.json
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@sanity/client";

import { buildLocalToday } from "../src/lib/date-utils";
import { toNewsletterPreviewBlock } from "../src/lib/newsletter/preview";
import { siteDefaults } from "../src/lib/seo/site-defaults";
import { NEWSLETTER_PREVIEW_QUERY } from "../src/sanity/lib/queries";
import type { NEWSLETTER_PREVIEW_QUERY_RESULT } from "../src/sanity/types";

const args = process.argv.slice(2);
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const outputArg = args.find((arg) => arg.startsWith("--output="));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "8", 10) : 8;
const outputPath = outputArg?.split("=")[1];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const baseUrl = siteDefaults.baseUrl;

if (!(projectId && dataset)) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-06-03",
  useCdn: false,
});

async function main() {
  const items = await client.fetch<NEWSLETTER_PREVIEW_QUERY_RESULT>(
    NEWSLETTER_PREVIEW_QUERY,
    {
      today: buildLocalToday(),
      limit,
    }
  );

  const blocks = items.map((item) => toNewsletterPreviewBlock(item, baseUrl));
  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    limit,
    blocks,
    manualPromoBlock: {
      note: "Insert sponsored content manually in Brevo when a placement exists.",
    },
  };

  const serialized = `${JSON.stringify(payload, null, 2)}\n`;

  if (outputPath) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, serialized, "utf-8");
    console.log(`Wrote ${blocks.length} preview block(s) to ${outputPath}`);
    return;
  }

  console.log(serialized);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
