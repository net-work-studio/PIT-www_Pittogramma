import { describe, expect, test } from "bun:test";

import { defaultSocialImage } from "./default-social-image";
import { mapSanityToMetadata } from "./map-sanity-to-metadata";
import { siteDefaults } from "./site-defaults";
import { staticPageMetadata } from "./static-page-metadata";

describe("social image metadata", () => {
  test("uses the generated site image for static pages", () => {
    const metadata = staticPageMetadata("/submit", "Submit", "Submit work");

    expect(metadata.openGraph?.images).toEqual([defaultSocialImage]);
    expect(metadata.twitter?.images).toEqual([defaultSocialImage.url]);
  });

  test("uses the generated site image when Sanity has no image", () => {
    const metadata = mapSanityToMetadata({
      baseUrl: siteDefaults.baseUrl,
      page: { title: "Projects" },
      path: "/projects",
      siteDefaults,
    });

    expect(metadata.openGraph?.images).toEqual([defaultSocialImage]);
    expect(metadata.twitter?.images).toEqual([defaultSocialImage.url]);
  });

  test("uses Sanity SEO fields before page-level fallbacks", () => {
    const metadata = mapSanityToMetadata({
      baseUrl: siteDefaults.baseUrl,
      page: {
        description: "Page description",
        seo: {
          canonicalURL: "/canonical-page",
          metaDescription: "Sanity description",
          metaRobots: "noindex, follow",
          metaTitle: "Sanity title",
        },
        title: "Page title",
      },
      path: "/page",
      siteDefaults,
    });

    expect(metadata.alternates?.canonical).toBe(
      `${siteDefaults.baseUrl}/canonical-page`
    );
    expect(metadata.description).toBe("Sanity description");
    expect(metadata.robots).toBe("noindex, follow");
    expect(metadata.title).toBe("Sanity title");
  });
});
