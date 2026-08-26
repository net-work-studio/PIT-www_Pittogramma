import { describe, expect, test } from "bun:test";

import {
  getEnabledResources,
  getFeatureAvailability,
} from "./feature-availability";

describe("feature availability", () => {
  test("preserves all public capabilities when Site Settings are unconfigured", () => {
    const availability = getFeatureAvailability(undefined);

    expect(getEnabledResources(availability)).toHaveLength(7);
    expect(availability.headerSearchEnabled).toBe(true);
    expect(availability.resources["studios-agencies"]).toEqual({
      enabledViews: ["list", "grid", "map"],
      published: true,
      searchEnabled: true,
    });
  });

  test("uses only configured supported views and hides unpublished Indexes", () => {
    const availability = getFeatureAvailability({
      indexAvailability: {
        headerSearchEnabled: false,
        websites: {
          enabledViews: ["map", "grid"],
          published: false,
          searchEnabled: false,
        },
      },
    });

    expect(availability.headerSearchEnabled).toBe(false);
    expect(availability.resources.websites).toEqual({
      enabledViews: ["grid"],
      published: false,
      searchEnabled: false,
    });
    expect(getEnabledResources(availability)).not.toContainEqual({
      href: "/websites",
      key: "websites",
      label: "Websites",
    });
  });

  test("keeps Bibliography published regardless of configured data", () => {
    const availability = getFeatureAvailability({
      indexAvailability: {
        bibliography: { published: false },
      },
    });

    expect(availability.resources.bibliography.published).toBe(true);
    expect(getEnabledResources(availability)).toContainEqual({
      href: "/bibliography",
      key: "bibliography",
      label: "Bibliography",
    });
  });

  test("retains a first supported view when invalid data disables every view", () => {
    const availability = getFeatureAvailability({
      indexAvailability: {
        bookshops: { enabledViews: [], published: true, searchEnabled: true },
      },
    });

    expect(availability.resources.bookshops.enabledViews).toEqual(["list"]);
  });
});
