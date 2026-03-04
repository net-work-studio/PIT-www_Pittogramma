import type {
  ImageWithMetadata,
  SanityImageAssetReference,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity/types";

/**
 * A flexible image type compatible with both schema types and query results.
 * Query results expand asset references into full objects with _id/url/metadata,
 * while schema types use SanityImageAssetReference with _ref/_type.
 */
export type SeoImageSource =
  | ImageWithMetadata
  | {
      _type?: "imageWithMetadata";
      image?: {
        _type?: "image";
        asset?:
          | SanityImageAssetReference
          | { _id: string; url: string; metadata?: unknown }
          | null;
        hotspot?: SanityImageHotspot | null;
        crop?: SanityImageCrop | null;
      } | null;
      alt?: string | null;
      caption?: string | null;
    };

export interface SeoModule {
  canonicalURL?: string;
  metaDescription?: string;
  metaImage?: SeoImageSource;
  metaRobots?: string;
  metaTitle?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
  };
  xCard?: {
    title?: string;
    description?: string;
  };
}

export interface PageWithSeo {
  coverImage?: SeoImageSource;
  description?: string;
  seo?: SeoModule;
  title: string;
}
