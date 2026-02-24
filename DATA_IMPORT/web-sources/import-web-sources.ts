/**
 * Import web sources from Notion CSV export into Sanity.
 *
 * Usage: bun run DATA_IMPORT/web-sources/import-web-sources.ts
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Sanity client (uses write token)
// ---------------------------------------------------------------------------

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-12-18",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!,
});

// ---------------------------------------------------------------------------
// OG metadata extraction (reused from src/app/api/websites/fetch-og/route.ts)
// ---------------------------------------------------------------------------

const OG_TITLE_REGEX =
  /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i;
const OG_TITLE_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i;
const OG_DESCRIPTION_REGEX =
  /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i;
const OG_DESCRIPTION_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i;
const OG_SITE_NAME_REGEX =
  /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i;
const OG_SITE_NAME_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i;
const OG_IMAGE_REGEX =
  /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i;
const OG_IMAGE_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i;
const TITLE_TAG_REGEX = /<title[^>]*>([^<]+)<\/title>/i;
const META_DESCRIPTION_REGEX =
  /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i;
const META_DESCRIPTION_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i;

function extractMeta(
  html: string,
  regex: RegExp,
  reverseRegex: RegExp,
): string | null {
  const match = html.match(regex) || html.match(reverseRegex);
  return match ? decodeHtmlEntities(match[1]) : null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

interface OgData {
  title: string | null;
  description: string | null;
  siteName: string | null;
  imageUrl: string | null;
}

function parseOgData(html: string, baseUrl: string): OgData {
  const ogTitle = extractMeta(html, OG_TITLE_REGEX, OG_TITLE_REVERSE_REGEX);
  const ogDescription = extractMeta(
    html,
    OG_DESCRIPTION_REGEX,
    OG_DESCRIPTION_REVERSE_REGEX,
  );
  const ogSiteName = extractMeta(
    html,
    OG_SITE_NAME_REGEX,
    OG_SITE_NAME_REVERSE_REGEX,
  );
  let ogImage = extractMeta(html, OG_IMAGE_REGEX, OG_IMAGE_REVERSE_REGEX);

  const titleTag = html.match(TITLE_TAG_REGEX);
  const metaDescription = extractMeta(
    html,
    META_DESCRIPTION_REGEX,
    META_DESCRIPTION_REVERSE_REGEX,
  );

  if (ogImage && !ogImage.startsWith("http")) {
    try {
      ogImage = new URL(ogImage, baseUrl).href;
    } catch {
      ogImage = null;
    }
  }

  return {
    title:
      ogTitle || (titleTag ? decodeHtmlEntities(titleTag[1].trim()) : null),
    description: ogDescription || metaDescription,
    siteName: ogSiteName,
    imageUrl: ogImage,
  };
}

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

interface CsvRow {
  name: string;
  category: string;
  link: string;
  tag: string;
}

function parseCsv(filePath: string): CsvRow[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  // Skip header row
  return lines.slice(1).map((line) => {
    const [name, category, link, tag] = line.split(",");
    return {
      name: name?.trim() ?? "",
      category: category?.trim() ?? "",
      link: link?.trim() ?? "",
      tag: tag?.trim() ?? "",
    };
  });
}

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Delay helper
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Category mapping
// ---------------------------------------------------------------------------

const CATEGORY_MAP: Record<string, string> = {
  Podcast: "podcast",
  "Platform / Magazine": "platform-magazine",
  "Archive / Library": "archive-library",
  "Resource / Learning": "resource-learning",
  Tools: "tools",
};

const DEFAULT_CATEGORY = "tools";

// ---------------------------------------------------------------------------
// Tag mapping — CSV tag name → existing Sanity tag _id (if it already exists)
// ---------------------------------------------------------------------------

const EXISTING_TAG_MAP: Record<string, string> = {
  "Data Visualization": "57a34922-fbca-4cd6-bd55-14e54800fd0f",
  "Design Systems": "c0a90f03-1925-4dd7-8d06-34ec48bc2e36",
  Packaging: "06d67770-9c04-4776-82b9-725ccea1d76c",
};

// ---------------------------------------------------------------------------
// Fetch OG data with retry on 429
// ---------------------------------------------------------------------------

async function fetchOgData(url: string): Promise<OgData | null> {
  const doFetch = async (): Promise<OgData | null> => {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });

    if (response.status === 429) {
      return null; // signal retry
    }

    if (!response.ok) {
      console.warn(`  HTTP ${response.status} for ${url}`);
      return { title: null, description: null, siteName: null, imageUrl: null };
    }

    const html = await response.text();
    const origin = new URL(url).origin;
    return parseOgData(html, origin);
  };

  try {
    const result = await doFetch();
    if (result === null) {
      // 429 — wait 30s and retry once
      console.warn(`  Rate limited (429) — waiting 30s and retrying…`);
      await delay(30_000);
      const retry = await doFetch();
      return retry ?? {
        title: null,
        description: null,
        siteName: null,
        imageUrl: null,
      };
    }
    return result;
  } catch (error) {
    console.warn(`  Fetch failed for ${url}:`, (error as Error).message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Upload an image from URL to Sanity assets
// ---------------------------------------------------------------------------

async function uploadImageFromUrl(
  imageUrl: string,
): Promise<string | null> {
  try {
    // Only download HTTPS images
    if (!imageUrl.startsWith("https://")) {
      console.warn(`  Skipping non-HTTPS image: ${imageUrl}`);
      return null;
    }

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      console.warn(`  Image download failed: HTTP ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      console.warn(`  Not an image content-type: ${contentType}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      contentType,
    });

    return asset._id;
  } catch (error) {
    console.warn(
      `  Image upload failed:`,
      (error as Error).message,
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Web Sources Import ===\n");

  // 1. Parse CSV
  const csvPath = resolve(
    import.meta.dir,
    "Web Sources 2a67f12bcce680a1a9defd4ba77a9633_all.csv",
  );
  const rows = parseCsv(csvPath);
  console.log(`Parsed ${rows.length} rows from CSV\n`);

  // 2. Fetch existing webSource URLs to skip duplicates
  const existingSources: string[] = await client.fetch(
    `*[_type == "webSource"].sourceUrl`,
  );
  const existingUrlSet = new Set(
    existingSources.map((url) => url?.toLowerCase()),
  );
  console.log(`Found ${existingSources.length} existing webSource docs\n`);

  // 3. Fetch existing categories
  const existingCategories: Array<{
    _id: string;
    slug: { current: string };
  }> = await client.fetch(
    `*[_type == "category"]{ _id, slug }`,
  );
  const categoryBySlug = new Map(
    existingCategories.map((c) => [c.slug.current, c._id]),
  );
  console.log(
    `Found ${existingCategories.length} existing categories: ${[...categoryBySlug.keys()].join(", ")}\n`,
  );

  // 4. Create missing categories
  const neededCategorySlugs = new Set(
    Object.values(CATEGORY_MAP),
  );
  for (const slug of neededCategorySlugs) {
    if (!categoryBySlug.has(slug)) {
      const name = Object.entries(CATEGORY_MAP).find(
        ([, s]) => s === slug,
      )![0];
      console.log(`Creating category: ${name} (${slug})`);
      const doc = await client.createOrReplace({
        _id: `category-${slug}`,
        _type: "category",
        name,
        slug: { _type: "slug", current: slug },
      });
      categoryBySlug.set(slug, doc._id);
    }
  }
  console.log("");

  // 5. Fetch existing tags
  const existingTags: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }> = await client.fetch(
    `*[_type == "tag"]{ _id, name, slug }`,
  );
  const tagByName = new Map(existingTags.map((t) => [t.name, t._id]));
  console.log(
    `Found ${existingTags.length} existing tags\n`,
  );

  // Build a lookup that includes the alias mappings
  const tagIdByCSVName = new Map<string, string>();
  for (const [csvName, existingId] of Object.entries(EXISTING_TAG_MAP)) {
    tagIdByCSVName.set(csvName, existingId);
  }
  // Also add direct name matches from existing tags
  for (const [name, id] of tagByName) {
    tagIdByCSVName.set(name, id);
  }

  // 6. Collect all unique CSV tags and create missing ones
  const allCsvTags = new Set(
    rows.map((r) => r.tag).filter(Boolean),
  );
  for (const csvTag of allCsvTags) {
    if (!tagIdByCSVName.has(csvTag)) {
      const slug = toSlug(csvTag);
      console.log(`Creating tag: ${csvTag} (${slug})`);
      const doc = await client.createOrReplace({
        _id: `tag-${slug}`,
        _type: "tag",
        name: csvTag,
        slug: { _type: "slug", current: slug },
      });
      tagIdByCSVName.set(csvTag, doc._id);
    }
  }
  console.log("");

  // 7. Import each row
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const idx = `[${i + 1}/${rows.length}]`;

    if (!row.link) {
      console.log(`${idx} SKIP (no link): ${row.name}`);
      skipped++;
      continue;
    }

    // Normalize URL for comparison
    if (existingUrlSet.has(row.link.toLowerCase())) {
      console.log(`${idx} SKIP (exists): ${row.name}`);
      skipped++;
      continue;
    }

    console.log(`${idx} Processing: ${row.name} — ${row.link}`);

    // Fetch OG data
    const ogData = await fetchOgData(row.link);

    // Upload cover image if available
    let imageAssetId: string | null = null;
    if (ogData?.imageUrl) {
      imageAssetId = await uploadImageFromUrl(ogData.imageUrl);
      if (imageAssetId) {
        console.log(`  Cover image uploaded`);
      }
    }

    // Resolve category
    const categorySlug =
      CATEGORY_MAP[row.category] ?? DEFAULT_CATEGORY;
    const categoryId = categoryBySlug.get(categorySlug);
    if (!categoryId) {
      console.error(`  ERROR: Category not found for slug ${categorySlug}`);
      failed++;
      continue;
    }

    // Resolve tag
    const tagId = row.tag ? tagIdByCSVName.get(row.tag) : undefined;

    // Build document
    const docId = `webSource-${toSlug(row.name)}`;
    const doc: Record<string, unknown> = {
      _id: docId,
      _type: "webSource",
      sourceUrl: row.link,
      name: row.name,
      category: {
        _type: "reference",
        _ref: categoryId,
      },
    };

    // OG fields
    if (ogData) {
      if (ogData.description) doc.description = ogData.description;
      if (ogData.title) doc.ogTitle = ogData.title;
      if (ogData.description) doc.ogDescription = ogData.description;
      if (ogData.siteName) doc.ogSiteName = ogData.siteName;
      if (ogData.imageUrl) doc.ogImageUrl = ogData.imageUrl;
    }

    // Cover image
    if (imageAssetId) {
      doc.cover = {
        _type: "imageWithMetadata",
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAssetId,
          },
        },
        alt: ogData?.title ?? row.name,
      };
    }

    // Tags
    if (tagId) {
      doc.tagSelector = {
        _type: "tagSelector",
        tags: [
          {
            _type: "tag",
            _ref: tagId,
            _key: tagId.slice(0, 12),
          },
        ],
      };
    }

    try {
      await client.createOrReplace(doc);
      created++;
      console.log(`  Created: ${docId}`);
    } catch (error) {
      console.error(
        `  ERROR creating ${docId}:`,
        (error as Error).message,
      );
      failed++;
    }

    // Rate limit delay between fetches (skip delay on last item)
    if (i < rows.length - 1) {
      await delay(7_000);
    }
  }

  // 8. Summary
  console.log("\n=== Import Complete ===");
  console.log(`Total CSV rows: ${rows.length}`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
