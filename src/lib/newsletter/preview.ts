import { getJournalHeroCover } from "@/lib/cover-media-utils";
import { resolveInternalLink } from "@/lib/resolve-link";
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

function getPreviewImageUrl(item: NewsletterPreviewItem): string | null {
  const cover =
    item._type === "journal" ? getJournalHeroCover(item) : item.cover;

  return (
    urlForImage(cover)
      ?.width(1200)
      .height(630)
      .auto("format")
      .url() ?? null
  );
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
  const path = resolveInternalLink({
    _type: item._type,
    slug: item.slug,
  });

  return {
    contentType: item._type,
    title: item.title.trim() || "Untitled",
    excerpt: getPreviewExcerpt(item),
    imageUrl: getPreviewImageUrl(item),
    ctaText: "Read more",
    destinationUrl: path ? `${baseUrl}${path}` : baseUrl,
    publishedDate: item.publishingDate.date ?? null,
    byline: getPreviewByline(item),
  };
}
