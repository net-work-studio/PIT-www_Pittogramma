import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { ImageWithMetadata } from "../types";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);

/** Extract the raw Sanity image from imageWithMetadata wrapper */
export const getImageSource = (
  source: ImageWithMetadata | null | undefined
): SanityImageSource | null => source?.image ?? null;

/** Build URL directly from imageWithMetadata */
export const urlForImage = (source: ImageWithMetadata | null | undefined) => {
  const img = getImageSource(source);
  return img ? builder.image(img) : null;
};

/** Generate blur data URL for Next.js Image placeholder */
export const getBlurDataUrl = (
  source: ImageWithMetadata | null | undefined
): string | undefined =>
  urlForImage(source)?.width(24).height(24).quality(5).auto("format").url();
