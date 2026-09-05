import { describe, expect, test } from "bun:test";

import { mergeSeoModules } from "./merge-seo-modules";

describe("mergeSeoModules", () => {
  test("uses the Site Settings image when homepage SEO has none", () => {
    const siteImage = {
      alt: "Pittogramma social image",
      image: {
        asset: { _ref: "image-site-settings-og-image-1200x630-png" },
      },
    };

    expect(
      mergeSeoModules(
        { metaImage: siteImage },
        { metaTitle: "Homepage title" }
      )
    ).toMatchObject({
      metaImage: siteImage,
      metaTitle: "Homepage title",
    });
  });

  test("uses a page image instead of the Site Settings image", () => {
    const siteImage = {
      image: { asset: { _ref: "image-site-settings-og-image-1200x630-png" } },
    };
    const pageImage = {
      image: { asset: { _ref: "image-page-og-image-1200x630-png" } },
    };

    expect(
      mergeSeoModules({ metaImage: siteImage }, { metaImage: pageImage })
    ).toMatchObject({ metaImage: pageImage });
  });

  test("uses page SEO values before Site Settings defaults", () => {
    expect(
      mergeSeoModules(
        {
          canonicalURL: "/site-default",
          metaDescription: "Site description",
          metaRobots: "index, follow",
          metaTitle: "Site title",
          openGraph: {
            description: "Site OG description",
            title: "Site OG title",
            url: "https://pittogramma.xyz",
          },
          xCard: {
            description: "Site X description",
            title: "Site X title",
          },
        },
        {
          canonicalURL: "/page",
          metaDescription: "Page description",
          metaRobots: "noindex, follow",
          metaTitle: "Page title",
          openGraph: {
            description: "Page OG description",
            title: "Page OG title",
            url: "https://pittogramma.xyz/page",
          },
          xCard: {
            description: "Page X description",
            title: "Page X title",
          },
        }
      )
    ).toMatchObject({
      canonicalURL: "/page",
      metaDescription: "Page description",
      metaRobots: "noindex, follow",
      metaTitle: "Page title",
      openGraph: {
        description: "Page OG description",
        title: "Page OG title",
        url: "https://pittogramma.xyz/page",
      },
      xCard: {
        description: "Page X description",
        title: "Page X title",
      },
    });
  });
});
