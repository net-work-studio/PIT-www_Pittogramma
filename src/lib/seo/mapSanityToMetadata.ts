// lib/seo/mapSanityToMetadata.ts
import type { Metadata } from "next";
import type { SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";

type MapSanityToMetadataProps = {
  page: {
    title: string;
    description?: string;
    coverImage?: any;
    seo?: SeoModule;
  };
  baseUrl: string;
  path: string;
  siteDefaults: {
    title: string;
    description: string;
  };
};

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
  const canonicalUrl = page.seo?.canonicalURL ? `${baseUrl}${page.seo.canonicalURL}` : `${baseUrl}${path}`;

  // Image fallback chain:
  // 1. OG image → 2. X Card image → 3. Meta image → 4. Cover image → undefined
  const ogImage =
    page.seo?.openGraph?.image || page.seo?.metaImage || page.coverImage;
  const xImage = page.seo?.xCard?.image || ogImage;
  const metaImage = page.seo?.metaImage || page.coverImage;

  // Helper to build image metadata
  const buildImageMeta = (image: any, altFallback: string) => {
    if (!image) {
      return;
    }
    return {
      url: urlForImage(image).url(),
      width: image.metadata?.dimensions?.width || 1200,
      height: image.metadata?.dimensions?.height || 630,
      alt: image.alt || altFallback,
    };
  };

  return {
    title,
    description,
    robots: (page.seo?.metaRobots as Metadata["robots"]) || "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: page.seo?.openGraph
      ? {
          title: page.seo.openGraph.title || title,
          description: page.seo.openGraph.description || description,
          url: page.seo.openGraph.url || canonicalUrl,
          images: ogImage ? [buildImageMeta(ogImage, title)] : undefined,
        }
      : {
          title,
          description,
          url: canonicalUrl,
          images: ogImage ? [buildImageMeta(ogImage, title)] : undefined,
        },
    twitter: page.seo?.xCard
      ? {
          card:
            (page.seo.xCard.cardType as "summary" | "summary_large_image") ||
            "summary_large_image",
          title: page.seo.xCard.title || title,
          description: page.seo.xCard.description || description,
          images: xImage ? [urlForImage(xImage).url()] : undefined,
        }
      : {
          card: "summary_large_image",
          title,
          description,
          images: xImage ? [urlForImage(xImage).url()] : undefined,
        },
    // For standard meta tags
    ...(metaImage && {
      // You can add custom meta tags if needed
      other: {
        "og:image": urlForImage(metaImage).url(),
      },
    }),
  };
}
