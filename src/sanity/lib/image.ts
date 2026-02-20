import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { ImageWithMetadata } from "../types";

interface AssetMetadata {
  lqip?: string;
  dimensions?: { width: number; height: number };
}

interface ImageLike {
  _type?: string;
  image?: {
    _type?: string;
    asset?: { _id?: string; url?: string; metadata?: AssetMetadata } | unknown;
    hotspot?: unknown;
    crop?: unknown;
  } | null;
  alt?: string | null;
}

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);

/** Extract the raw Sanity image from imageWithMetadata wrapper */
export const getImageSource = (
  source: ImageWithMetadata | ImageLike | null | undefined
): SanityImageSource | null => source?.image ?? null;

/** Build URL directly from imageWithMetadata */
export const urlForImage = (
  source: ImageWithMetadata | ImageLike | null | undefined
) => {
  const img = getImageSource(source);
  return img ? builder.image(img) : null;
};

/** Extract native LQIP from resolved asset metadata */
export const getLqip = (
  source: ImageWithMetadata | ImageLike | null | undefined,
): string | undefined => {
  const asset = source?.image?.asset;
  if (asset && typeof asset === "object" && "metadata" in asset) {
    const meta = (asset as { metadata?: AssetMetadata }).metadata;
    return meta?.lqip ?? undefined;
  }
  return undefined;
};

/** Extract image dimensions from resolved asset metadata */
export const getImageDimensions = (
  source: ImageWithMetadata | ImageLike | null | undefined,
): { width: number; height: number } | undefined => {
  const asset = source?.image?.asset;
  if (asset && typeof asset === "object" && "metadata" in asset) {
    const meta = (asset as { metadata?: AssetMetadata }).metadata;
    return meta?.dimensions ?? undefined;
  }
  return undefined;
};

/** Generate blur data URL for Next.js Image placeholder.
 *  Prefers native LQIP from metadata, falls back to tiny CDN image. */
export const getBlurDataUrl = (
  source: ImageWithMetadata | ImageLike | null | undefined,
): string | undefined => {
  const lqip = getLqip(source);
  if (lqip) return lqip;
  return urlForImage(source)?.width(24).height(24).quality(5).auto("format").url();
};
