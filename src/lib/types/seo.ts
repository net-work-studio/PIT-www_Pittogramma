import type {
  ImageWithMetadata,
  SanityImageAssetReference,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity/types";

/**
 * A flexible image type compatible with both schema types and query results.
 * Query results use `null` while schema types use `undefined`.
 */
export type SeoImageSource =
  | ImageWithMetadata
  | {
      _type?: "imageWithMetadata";
      image?: {
        _type?: "image";
        asset?: SanityImageAssetReference | null;
        hotspot?: SanityImageHotspot | null;
        crop?: SanityImageCrop | null;
      } | null;
      alt?: string | null;
      caption?: string | null;
    };

export interface SeoModule {
  metaTitle?: string;
  metaDescription?: string;
  metaRobots?: string;
  canonicalURL?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: SeoImageSource;
    url?: string;
  };
  xCard?: {
    cardType?: string;
    title?: string;
    description?: string;
    image?: SeoImageSource;
  };
  metaImage?: SeoImageSource;
}

export interface PageWithSeo {
  title: string;
  description?: string;
  coverImage?: SeoImageSource;
  seo?: SeoModule;
}
