/**
 * Bulk script: Fetch OG data for all typeFoundry documents
 *
 * Run with:
 *   bun run scripts/fetch-type-foundries-og.ts
 *
 * What it does:
 * 1. Fetches all typeFoundry documents with a "website" social link
 * 2. Fetches OG metadata (title, description, siteName, imageUrl) from each website
 * 3. Downloads and uploads OG images to Sanity
 * 4. Patches each typeFoundry document with the fetched data
 * 5. Rate-limited to ~2 req/sec to be polite to target servers
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!(projectId && dataset && token)) {
  console.error(
    "Missing environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN"
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

// --- OG parsing (same regex logic as fetch-og API route) ---

const OG_TITLE_RE =
  /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i;
const OG_TITLE_REV_RE =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i;
const OG_DESC_RE =
  /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i;
const OG_DESC_REV_RE =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i;
const OG_SITE_RE =
  /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i;
const OG_SITE_REV_RE =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i;
const OG_IMAGE_RE =
  /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i;
const OG_IMAGE_REV_RE =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i;
const TITLE_TAG_RE = /<title[^>]*>([^<]+)<\/title>/i;
const META_DESC_RE =
  /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i;
const META_DESC_REV_RE =
  /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i;

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function extractMeta(html: string, re: RegExp, revRe: RegExp): string | null {
  const match = html.match(re) || html.match(revRe);
  return match ? decodeHtml(match[1]) : null;
}

interface OgData {
  description: string | null;
  imageUrl: string | null;
  siteName: string | null;
  title: string | null;
}

function parseOgData(html: string, baseUrl: string): OgData {
  const ogTitle = extractMeta(html, OG_TITLE_RE, OG_TITLE_REV_RE);
  const ogDesc = extractMeta(html, OG_DESC_RE, OG_DESC_REV_RE);
  const ogSite = extractMeta(html, OG_SITE_RE, OG_SITE_REV_RE);
  let ogImage = extractMeta(html, OG_IMAGE_RE, OG_IMAGE_REV_RE);

  const titleTag = html.match(TITLE_TAG_RE);
  const metaDesc = extractMeta(html, META_DESC_RE, META_DESC_REV_RE);

  if (ogImage && !ogImage.startsWith("http")) {
    try {
      ogImage = new URL(ogImage, baseUrl).href;
    } catch {
      ogImage = null;
    }
  }

  return {
    title: ogTitle || (titleTag ? decodeHtml(titleTag[1].trim()) : null),
    description: ogDesc || metaDesc,
    siteName: ogSite,
    imageUrl: ogImage,
  };
}

// --- Helpers ---

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TypeFoundryDoc {
  _id: string;
  name: string;
  websiteUrl: string | null;
}

async function fetchOgData(url: string): Promise<OgData | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const origin = new URL(url).origin;
    return parseOgData(html, origin);
  } catch {
    return null;
  }
}

async function uploadImage(
  imageUrl: string,
  siteName: string | null
): Promise<{ _type: string; image: unknown; alt: string } | null> {
  try {
    // Upgrade HTTP to HTTPS
    const secureUrl = imageUrl.replace(/^http:\/\//, "https://");

    const response = await fetch(secureUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    const ext = contentType.split("/")[1]?.split(";")[0] || "jpg";
    const blob = await response.blob();
    const asset = await client.assets.upload("image", blob, {
      filename: `cover-${siteName || "website"}.${ext}`,
    });

    return {
      _type: "imageWithMetadata",
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
      alt: siteName || "Website cover",
    };
  } catch {
    return null;
  }
}

// --- Main ---

async function main() {
  console.log("=== Fetch OG Data for Type Foundries ===\n");

  const docs: TypeFoundryDoc[] = await client.fetch(
    `*[_type == "typeFoundry"] | order(name asc) {
      _id,
      name,
      "websiteUrl": socialLinks.links[platform == "website"][0].url
    }`
  );

  // Filter to type foundries that have a website URL
  const withUrl = docs.filter(
    (d): d is TypeFoundryDoc & { websiteUrl: string } => !!d.websiteUrl
  );

  console.log(
    `Found ${docs.length} type foundries total, ${withUrl.length} with website URLs\n`
  );

  if (withUrl.length === 0) {
    console.log("Nothing to process.");
    process.exit(0);
  }

  let success = 0;
  let skipped = 0;
  let errors = 0;
  let imageUploads = 0;

  for (let i = 0; i < withUrl.length; i++) {
    const doc = withUrl[i];
    const progress = `[${i + 1}/${withUrl.length}]`;

    try {
      const ogData = await fetchOgData(doc.websiteUrl);

      if (!(ogData && (ogData.title || ogData.siteName))) {
        console.log(`${progress} SKIP: ${doc.name} — no OG data found`);
        skipped++;
        await delay(500);
        continue;
      }

      const patchData: Record<string, unknown> = {};

      if (ogData.description) {
        patchData.description = ogData.description;
      }
      if (ogData.title) {
        patchData.ogTitle = ogData.title;
      }
      if (ogData.description) {
        patchData.ogDescription = ogData.description;
      }
      if (ogData.siteName) {
        patchData.ogSiteName = ogData.siteName;
      }
      if (ogData.imageUrl) {
        patchData.ogImageUrl = ogData.imageUrl;

        const coverData = await uploadImage(ogData.imageUrl, ogData.siteName);
        if (coverData) {
          patchData.cover = coverData;
          imageUploads++;
        }
      }

      await client.patch(doc._id).set(patchData).commit();

      const hasImage = ogData.imageUrl ? " + image" : "";
      console.log(
        `${progress} OK: ${doc.name} — ${ogData.siteName || ogData.title}${hasImage}`
      );
      success++;
    } catch (err) {
      console.error(
        `${progress} ERROR: ${doc.name} — ${err instanceof Error ? err.message : err}`
      );
      errors++;
    }

    // Rate limit: ~2 req/sec
    await delay(500);
  }

  console.log(
    `\nDone: ${success} updated, ${imageUploads} images uploaded, ${skipped} skipped, ${errors} errors\n`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
