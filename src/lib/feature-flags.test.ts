import { afterEach, describe, expect, test } from "bun:test";

import { getEnabledResources, isResourceEnabled } from "./feature-flags";

const originalBibliographyFlag = process.env.NEXT_PUBLIC_FEATURE_BIBLIOGRAPHY;

afterEach(() => {
  if (originalBibliographyFlag === undefined) {
    delete process.env.NEXT_PUBLIC_FEATURE_BIBLIOGRAPHY;
    return;
  }
  process.env.NEXT_PUBLIC_FEATURE_BIBLIOGRAPHY = originalBibliographyFlag;
});

describe("Bibliography publication", () => {
  test("remains published and navigable when the retired flag is false", () => {
    process.env.NEXT_PUBLIC_FEATURE_BIBLIOGRAPHY = "false";

    expect(isResourceEnabled("bibliography")).toBe(true);
    expect(getEnabledResources()).toContainEqual({
      href: "/bibliography",
      key: "bibliography",
      label: "Bibliography",
    });
  });
});
