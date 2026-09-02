import type { Metadata } from "next";

import { defaultSocialImage } from "./default-social-image";
import { siteDefaults } from "./site-defaults";

export function staticPageMetadata(
  path: string,
  title: string,
  description: string
): Metadata {
  const url = `${siteDefaults.baseUrl}${path}`;

  return {
    alternates: { canonical: url },
    description,
    openGraph: {
      description,
      images: [defaultSocialImage],
      title,
      type: "website",
      url,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [defaultSocialImage.url],
      title,
    },
  };
}
