import { urlForImage } from "@/sanity/lib/image";
import type { NEWSLETTER_PREVIEW_QUERY_RESULT } from "@/sanity/types";

export type NewsletterPreviewItem = NEWSLETTER_PREVIEW_QUERY_RESULT[number];

export interface NewsletterPreviewBlock {
  byline: string | null;
  contentType: "project" | "journal";
  ctaText: string;
  destinationUrl: string;
  excerpt: string;
  imageUrl: string | null;
  publishedDate: string | null;
  title: string;
}

function getPreviewCover(item: NewsletterPreviewItem) {
  if (item._type === "journal") {
    return item.featuredCover ?? item.cover;
  }

  return item.cover;
}

function getPreviewImageUrl(item: NewsletterPreviewItem): string | null {
  return (
    urlForImage(getPreviewCover(item))
      ?.width(1200)
      .height(630)
      .auto("format")
      .url() ?? null
  );
}

function getPreviewDestinationUrl(
  item: NewsletterPreviewItem,
  baseUrl: string
): string {
  const slug = item.slug.current;

  if (item._type === "project") {
    return `${baseUrl}/projects/${slug}`;
  }

  return `${baseUrl}/journal/${slug}`;
}

function getPreviewExcerpt(item: NewsletterPreviewItem): string {
  if (item._type === "project") {
    return item.description?.trim() || item.title.trim();
  }

  return item.excerpt?.trim() || item.title.trim();
}

function getPreviewByline(item: NewsletterPreviewItem): string | null {
  const names = item.people?.map((person) => person.name).filter(Boolean);

  if (!names?.length) {
    return null;
  }

  return names.join(", ");
}

export function toNewsletterPreviewBlock(
  item: NewsletterPreviewItem,
  baseUrl: string
): NewsletterPreviewBlock {
  return {
    contentType: item._type,
    title: item.title.trim() || "Untitled",
    excerpt: getPreviewExcerpt(item),
    imageUrl: getPreviewImageUrl(item),
    ctaText: "Read more",
    destinationUrl: getPreviewDestinationUrl(item, baseUrl),
    publishedDate: item.publishingDate.date ?? null,
    byline: getPreviewByline(item),
  };
}
