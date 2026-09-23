// lib/seo/mapSanityToMetadata.ts
import type { Metadata } from "next";
import type { SeoImageSource, SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { defaultSocialImage } from "./default-social-image";
import { mergeSeoModules } from "./merge-seo-modules";
import { getSiteSettingsSeo } from "./site-settings-seo";

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

export async function mapSanityToMetadata({
  page,
  baseUrl,
  path,
  siteDefaults,
}: MapSanityToMetadataProps): Promise<Metadata> {
  const seo = mergeSeoModules(await getSiteSettingsSeo(), page.seo);

  // Title fallback chain: SEO metaTitle → page title → site title
  const title = seo?.metaTitle || page.title || siteDefaults.title;

  // Description fallback chain: SEO metaDescription → page description → site description
  const description =
    seo?.metaDescription || page.description || siteDefaults.description;

  // Canonical URL
  const canonicalUrl = seo?.canonicalURL
    ? `${baseUrl}${seo.canonicalURL}`
    : `${baseUrl}${path}`;

  // Single image source for all platforms
  const sharedImage = seo?.metaImage || page.coverImage;

  const buildOpenGraph = (): Metadata["openGraph"] => {
    const imageBuilder = sharedImage ? urlForImage(sharedImage) : undefined;
    const imageMeta = imageBuilder
      ? {
          alt: sharedImage?.alt || title,
          height: 630,
          url: imageBuilder.width(1200).height(630).url(),
          width: 1200,
        }
      : undefined;

    return {
      description: seo?.openGraph?.description || description,
      images: [imageMeta ?? defaultSocialImage],
      siteName: siteDefaults.title || "Pittogramma",
      title: seo?.openGraph?.title || title,
      url: seo?.openGraph?.url || canonicalUrl,
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
      description: seo?.xCard?.description || description,
      images: images ?? [defaultSocialImage.url],
      title: seo?.xCard?.title || title,
    };
  };

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    description,
    openGraph: buildOpenGraph(),
    robots: (seo?.metaRobots as Metadata["robots"]) || "index, follow",
    title,
    twitter: buildTwitter(),
  };
}
