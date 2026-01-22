// lib/seo/mapSanityToMetadata.ts
import type { Metadata } from "next";
import type { SeoImageSource, SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";

interface MapSanityToMetadataProps {
  page: {
    title: string;
    description?: string;
    coverImage?: SeoImageSource;
    seo?: SeoModule;
  };
  baseUrl: string;
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

  // Image fallback chain:
  // 1. OG image → 2. X Card image → 3. Meta image → 4. Cover image → undefined
  const ogImage =
    page.seo?.openGraph?.image || page.seo?.metaImage || page.coverImage;
  const xImage = page.seo?.xCard?.image || ogImage;
  const metaImage = page.seo?.metaImage || page.coverImage;

  // Helper to build image metadata
  const buildImageMeta = (
    image: SeoImageSource | null | undefined,
    altFallback: string
  ) => {
    if (!image) {
      return;
    }
    const builder = urlForImage(image);
    if (!builder) {
      return;
    }
    return {
      url: builder.url(),
      width: 1200,
      height: 630,
      alt: image.alt || altFallback,
    };
  };

  const buildOpenGraph = (): Metadata["openGraph"] => {
    const imageMeta = ogImage ? buildImageMeta(ogImage, title) : undefined;
    return {
      title: page.seo?.openGraph?.title || title,
      description: page.seo?.openGraph?.description || description,
      url: page.seo?.openGraph?.url || canonicalUrl,
      images: imageMeta ? [imageMeta] : undefined,
    };
  };

  const buildTwitter = (): Metadata["twitter"] => {
    const cardType =
      (page.seo?.xCard?.cardType as "summary" | "summary_large_image") ||
      "summary_large_image";
    const images = xImage
      ? ([urlForImage(xImage)?.url()].filter(Boolean) as string[])
      : undefined;

    return {
      card: cardType,
      title: page.seo?.xCard?.title || title,
      description: page.seo?.xCard?.description || description,
      images,
    };
  };

  const buildOtherMeta = (): Metadata["other"] | undefined => {
    const imageUrl = metaImage ? urlForImage(metaImage)?.url() : undefined;
    if (!imageUrl) {
      return undefined;
    }
    return { "og:image": imageUrl };
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
    other: buildOtherMeta(),
  };
}
