import { siteDefaults } from "./site-defaults";

export const defaultSocialImageAlt = "Pittogramma — emerging graphic design";

export const defaultSocialImage = {
  alt: defaultSocialImageAlt,
  height: 630,
  url: new URL("/opengraph-image", siteDefaults.baseUrl).toString(),
  width: 1200,
};
