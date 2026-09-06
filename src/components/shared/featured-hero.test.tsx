import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "jfvmcjyl";

const { default: FeaturedHero } = await import("./featured-hero");

const cover = {
  image: {
    asset: {
      _ref: "image-0123456789abcdef0123456789abcdef01234567-1600x1200-webp",
      metadata: { dimensions: { height: 1200, width: 1600 } },
    },
  },
};

test("generates responsive candidates when the homepage caps the featured image", () => {
  const markup = renderToStaticMarkup(
    <FeaturedHero
      contentType="project"
      cover={cover}
      href="/projects/featured"
      imageFillWidth={1600}
      title="Featured project"
    />
  );

  expect(markup).toContain("srcSet=");
  expect(markup).toContain('sizes="(max-width: 1280px) 100vw, 75vw"');
});
