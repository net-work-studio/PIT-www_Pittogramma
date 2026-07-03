"use client";

import SanityImage from "@/components/modules/shared/sanity-image";
import VideoPlayer from "@/components/modules/shared/video-player";
import { hasCoverMedia } from "@/lib/cover-media-utils";
import { urlForImage } from "@/sanity/lib/image";

export interface CoverMediaData {
  alt?: string | null;
  caption?: string | null;
  image?: {
    asset?: unknown;
    hotspot?: unknown;
    crop?: unknown;
  } | null;
  type?: string | null;
  videoUrl?: string | null;
}

interface CoverMediaProps {
  className?: string;
  cover: CoverMediaData | null | undefined;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export default function CoverMedia({
  cover,
  className,
  fill,
  priority,
  sizes,
}: CoverMediaProps) {
  if (!cover) {
    return null;
  }

  if (!hasCoverMedia(cover)) {
    return null;
  }

  if (cover.type === "video" && cover.videoUrl) {
    const posterUrl = cover.image?.asset
      ? (urlForImage(cover)?.width(1920).quality(75).auto("format").url() ??
        undefined)
      : undefined;

    return (
      <VideoPlayer
        className={className}
        poster={posterUrl}
        src={cover.videoUrl}
      />
    );
  }

  if (!cover.image?.asset) {
    return null;
  }

  return (
    <SanityImage
      className={className}
      fill={fill}
      priority={priority}
      sizes={sizes}
      source={cover}
    />
  );
}
