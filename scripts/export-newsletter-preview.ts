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
import { dirname, join } from "node:path";
import { createClient } from "@sanity/client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

interface CoverAsset {
  image?: {
    asset?: SanityImageSource;
  } | null;
}

interface PreviewPerson {
  name?: string | null;
}

interface PreviewItem {
  _id: string;
  _type: "project" | "journal";
  cover?: CoverAsset | null;
  description?: string | null;
  excerpt?: string | null;
  featuredCover?: CoverAsset | null;
  label?: string | null;
  people?: PreviewPerson[] | null;
  publishingDate?: { date?: string | null } | null;
  slug?: { current?: string | null } | null;
  title?: string | null;
}

interface NewsletterPreviewBlock {
  byline: string | null;
  contentType: "project" | "journal";
  ctaText: string;
  destinationUrl: string;
  excerpt: string;
  imageUrl: string | null;
  publishedDate: string | null;
  title: string;
}

const args = process.argv.slice(2);
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const outputArg = args.find((arg) => arg.startsWith("--output="));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "8", 10) : 8;
const outputPath = outputArg?.split("=")[1];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pittogramma.xyz";

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

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

const NEWSLETTER_PREVIEW_QUERY = `
  *[
    _type in ["project", "journal"]
    && defined(publishingDate.date)
    && publishingDate.date <= $today
  ] | order(publishingDate.date desc) [0...$limit] {
    _id,
    _type,
    title,
    slug,
    publishingDate,
    cover {
      image {
        asset
      }
    },
    _type == "project" => {
      description,
      "people": designers[]{ ...@->{ _id, name }, _key },
    },
    _type == "journal" => {
      excerpt,
      featuredCover {
        image {
          asset
        }
      },
      "people": authors[]{ ...@->{ _id, name }, _key },
      label,
    },
  }
`;

function getImageUrl(item: PreviewItem): string | null {
  const source =
    item._type === "journal"
      ? (item.featuredCover?.image?.asset ?? item.cover?.image?.asset)
      : item.cover?.image?.asset;

  if (!source) {
    return null;
  }

  return imageBuilder
    .image(source)
    .width(1200)
    .height(630)
    .auto("format")
    .url();
}

function getDestinationUrl(item: PreviewItem): string {
  const slug = item.slug?.current ?? "";
  if (item._type === "project") {
    return `${baseUrl}/projects/${slug}`;
  }
  return `${baseUrl}/journal/${slug}`;
}

function getExcerpt(item: PreviewItem): string {
  if (item._type === "project") {
    return item.description?.trim() || item.title?.trim() || "";
  }
  return item.excerpt?.trim() || item.title?.trim() || "";
}

function getByline(item: PreviewItem): string | null {
  const names = item.people?.map((person) => person.name).filter(Boolean);
  if (!names?.length) {
    return null;
  }
  return names.join(", ");
}

function toPreviewBlock(item: PreviewItem): NewsletterPreviewBlock {
  return {
    contentType: item._type,
    title: item.title?.trim() || "Untitled",
    excerpt: getExcerpt(item),
    imageUrl: getImageUrl(item),
    ctaText: "Read more",
    destinationUrl: getDestinationUrl(item),
    publishedDate: item.publishingDate?.date ?? null,
    byline: getByline(item),
  };
}

async function main() {
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const items = await client.fetch<PreviewItem[]>(NEWSLETTER_PREVIEW_QUERY, {
    today: todayString,
    limit,
  });

  const blocks = items.map(toPreviewBlock);
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
