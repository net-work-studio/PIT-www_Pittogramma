import type { CoverMediaData } from "@/components/modules/shared/cover-media";

export function hasCoverMedia(
  cover: CoverMediaData | null | undefined
): boolean {
  if (!cover) {
    return false;
  }

  return (
    Boolean(cover.image?.asset) ||
    (cover.type === "video" && Boolean(cover.videoUrl))
  );
}

/** Prefer featuredCover when it has media; otherwise fall back to cover. */
export function resolveJournalHeroCover(article: {
  cover?: CoverMediaData | null;
  featuredCover?: CoverMediaData | null;
}): CoverMediaData | null | undefined {
  if (hasCoverMedia(article.featuredCover)) {
    return article.featuredCover;
  }

  return article.cover;
}

/** Resolve journal hero cover only when it has renderable media. */
export function getJournalHeroCover(article: {
  cover?: CoverMediaData | null;
  featuredCover?: CoverMediaData | null;
}): CoverMediaData | null {
  const cover = resolveJournalHeroCover(article);
  return hasCoverMedia(cover) ? (cover ?? null) : null;
}
