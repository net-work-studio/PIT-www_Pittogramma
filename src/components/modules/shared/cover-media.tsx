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
  preserveAnimation?: boolean | null;
  type?: string | null;
  videoUrl?: string | null;
}

interface CoverMediaProps {
  className?: string;
  cover: CoverMediaData | null | undefined;
  fetchPriority?: "high" | "low" | "auto";
  fill?: boolean;
  fillWidth?: number;
  loading?: "eager" | "lazy";
  priority?: boolean;
  sizes?: string;
}

export default function CoverMedia({
  cover,
  className,
  fetchPriority,
  fill,
  fillWidth,
  loading,
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
      fetchPriority={fetchPriority}
      fill={fill}
      fillWidth={fillWidth}
      loading={loading}
      preserveAnimation={cover.preserveAnimation === true}
      priority={priority}
      sizes={sizes}
      source={cover}
    />
  );
}
