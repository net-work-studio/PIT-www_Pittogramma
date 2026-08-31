import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "jfvmcjyl";

const { default: SanityImage } = await import("./sanity-image");

const source = {
  image: {
    asset: {
      _ref: "image-0123456789abcdef0123456789abcdef01234567-800x600-png",
    },
  },
};

test("uses cover only when a caller has not supplied an object-fit class", () => {
  const markup = renderToStaticMarkup(<SanityImage source={source} />);
  const containMarkup = renderToStaticMarkup(
    <SanityImage className="object-contain" source={source} />
  );

  expect(markup).toContain("object-cover");
  expect(containMarkup).toContain("object-contain");
  expect(containMarkup).not.toContain("object-fit:cover");
});

test("makes an explicit objectFit prop authoritative", () => {
  const markup = renderToStaticMarkup(
    <SanityImage className="object-cover" objectFit="contain" source={source} />
  );

  expect(markup).toContain("object-fit:contain");
});
