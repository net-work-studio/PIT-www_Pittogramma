import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { ImageWithMetadata } from "../types";

interface ImageLike {
  _type?: string;
  image?: {
    _type?: string;
    asset?: unknown;
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

/** Generate blur data URL for Next.js Image placeholder */
export const getBlurDataUrl = (
  source: ImageWithMetadata | ImageLike | null | undefined
): string | undefined =>
  urlForImage(source)?.width(24).height(24).quality(5).auto("format").url();
