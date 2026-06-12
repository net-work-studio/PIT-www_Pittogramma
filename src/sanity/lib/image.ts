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

interface ImageAssetLike {
  _id?: string;
  _ref?: string;
  extension?: string;
  metadata?: AssetMetadata;
  mimeType?: string;
  url?: string;
}

interface ImageLike {
  _type?: string;
  alt?: string | null;
  image?: {
    _type?: string;
    asset?: ImageAssetLike | unknown;
    hotspot?: unknown;
    crop?: unknown;
  } | null;
}

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });
const ANIMATED_IMAGE_EXTENSIONS = new Set(["gif", "webp"]);
const SANITY_IMAGE_ID_PATTERN =
  /^image-(?<assetId>.+)-(?<dimensions>\d+x\d+)-(?<extension>[a-z0-9]+)$/i;

export const urlFor = (source: SanityImageSource) => builder.image(source);

const getImageAsset = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): ImageAssetLike | undefined => {
  const asset = source?.image?.asset;
  return asset && typeof asset === "object"
    ? (asset as ImageAssetLike)
    : undefined;
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

/** Extract the original Sanity CDN URL without image transformations. */
export const getImageAssetUrl = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined => {
  const asset = getImageAsset(source);
  if (asset?.url) {
    return asset.url;
  }

  const id = asset?._id ?? asset?._ref;
  const match = id?.match(SANITY_IMAGE_ID_PATTERN);
  if (!match?.groups) {
    return;
  }

  const { assetId, dimensions, extension } = match.groups;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${extension}`;
};

/** Extract the image asset extension from resolved assets or Sanity image refs. */
export const getImageAssetExtension = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined => {
  const asset = getImageAsset(source);
  if (asset?.extension) {
    return asset.extension.toLowerCase();
  }
  if (asset?.mimeType?.startsWith("image/")) {
    return asset.mimeType.slice("image/".length).toLowerCase();
  }

  const urlExtension = asset?.url?.split("?")[0]?.match(/\.([a-z0-9]+)$/i)?.[1];
  if (urlExtension) {
    return urlExtension.toLowerCase();
  }

  const id = asset?._id ?? asset?._ref;
  return id?.match(SANITY_IMAGE_ID_PATTERN)?.groups?.extension.toLowerCase();
};

export const isAnimatedImageAsset = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): boolean => {
  const extension = getImageAssetExtension(source);
  return extension ? ANIMATED_IMAGE_EXTENSIONS.has(extension) : false;
};

/** Extract native LQIP from resolved asset metadata */
export const getLqip = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined => {
  return getImageAsset(source)?.metadata?.lqip ?? undefined;
};

/** Extract image dimensions from resolved asset metadata */
export const getImageDimensions = (
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): { width: number; height: number } | undefined => {
  return getImageAsset(source)?.metadata?.dimensions ?? undefined;
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
