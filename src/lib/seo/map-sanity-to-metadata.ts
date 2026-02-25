// lib/seo/mapSanityToMetadata.ts
import type { Metadata } from "next";
import type { SeoImageSource, SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";

interface MapSanityToMetadataProps {
  baseUrl: string;
  page: {
    title: string;
    description?: string;
    coverImage?: SeoImageSource;
    seo?: SeoModule;
  };
  path: string;
  siteDefaults: {
    title: string;
    description: string;
  };
}

export function mapSanityToMetadata({
  page,
  baseUrl,
  path,
  siteDefaults,
}: MapSanityToMetadataProps): Metadata {
  // Title fallback chain: SEO metaTitle → page title → site title
  const title = page.seo?.metaTitle || page.title || siteDefaults.title;

  // Description fallback chain: SEO metaDescription → page description → site description
  const description =
    page.seo?.metaDescription || page.description || siteDefaults.description;

  // Canonical URL
  const canonicalUrl = page.seo?.canonicalURL
    ? `${baseUrl}${page.seo.canonicalURL}`
    : `${baseUrl}${path}`;

  // Single image source for all platforms
  const sharedImage = page.seo?.metaImage || page.coverImage;

  const buildOpenGraph = (): Metadata["openGraph"] => {
    const imageBuilder = sharedImage ? urlForImage(sharedImage) : undefined;
    const imageMeta = imageBuilder
      ? {
          url: imageBuilder.width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: sharedImage?.alt || title,
        }
      : undefined;

    return {
      title: page.seo?.openGraph?.title || title,
      description: page.seo?.openGraph?.description || description,
      url: page.seo?.openGraph?.url || canonicalUrl,
      images: imageMeta ? [imageMeta] : undefined,
    };
  };

  const buildTwitter = (): Metadata["twitter"] => {
    let images: string[] | undefined;
    if (sharedImage) {
      const imageBuilder = urlForImage(sharedImage);
      if (imageBuilder) {
        images = [imageBuilder.width(1200).height(630).url()];
      }
    }

    return {
      card: "summary_large_image",
      title: page.seo?.xCard?.title || title,
      description: page.seo?.xCard?.description || description,
      images,
    };
  };

  return {
    title,
    description,
    robots: (page.seo?.metaRobots as Metadata["robots"]) || "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: buildOpenGraph(),
    twitter: buildTwitter(),
  };
}
