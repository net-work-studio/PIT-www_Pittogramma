import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { CoverMedia, ImageWithMetadata } from "../types";

interface AssetMetadata {
  dimensions?: { width: number; height: number };
  lqip?: string;
}

export interface ImageLike {
  _type?: string;
  alt?: string | null;
  image?: {
    _type?: string;
    asset?: { _id?: string; url?: string; metadata?: AssetMetadata } | unknown;
    hotspot?: unknown;
    crop?: unknown;
  } | null;
}

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);

/** CSS object-position from Sanity hotspot focal point (for fill + object-cover). */
export const getHotspotObjectPosition = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined => {
  const hotspot = source?.image?.hotspot;
  if (
    typeof hotspot !== "object" ||
    hotspot === null ||
    !("x" in hotspot) ||
    !("y" in hotspot) ||
    typeof hotspot.x !== "number" ||
    typeof hotspot.y !== "number"
  ) {
    return undefined;
  }
  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
};

/** Extract the raw Sanity image from imageWithMetadata wrapper */
export const getImageSource = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): SanityImageSource | null =>
  source?.image?.asset ? (source.image as SanityImageSource) : null;

/** Build URL directly from imageWithMetadata */
export const urlForImage = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
) => {
  const img = getImageSource(source);
  return img ? builder.image(img) : null;
};

/** Extract native LQIP from resolved asset metadata */
export const getLqip = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined => {
  const asset = source?.image?.asset;
  if (asset && typeof asset === "object" && "metadata" in asset) {
    const meta = (asset as { metadata?: AssetMetadata }).metadata;
    return meta?.lqip ?? undefined;
  }
  return;
};

/** Extract image dimensions from resolved asset metadata */
export const getImageDimensions = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): { width: number; height: number } | undefined => {
  const asset = source?.image?.asset;
  if (asset && typeof asset === "object" && "metadata" in asset) {
    const meta = (asset as { metadata?: AssetMetadata }).metadata;
    return meta?.dimensions ?? undefined;
  }
  return;
};

/** Generate blur data URL for Next.js Image placeholder.
 *  Prefers native LQIP from metadata, falls back to tiny CDN image. */
export const getBlurDataUrl = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined => {
  const lqip = getLqip(source);
  if (lqip) {
    return lqip;
  }
  return urlForImage(source)
    ?.width(24)
    .height(24)
    .quality(5)
    .auto("format")
    .url();
};
