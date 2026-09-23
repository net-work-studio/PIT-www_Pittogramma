import { describe, expect, test } from "bun:test";

import {
  getPublicSiteRobotsHeader,
  HOLDING_PAGE_ROBOTS_HEADER,
} from "./public-site-robots";

describe("public site robots header", () => {
  test("allows search engines to index the live site", () => {
    expect(getPublicSiteRobotsHeader({ mode: "live" })).toBeNull();
  });

  test("prevents indexing while the public site is held", () => {
    expect(
      getPublicSiteRobotsHeader({
        heading: "Coming soon",
        launchAt: "2026-09-01T08:00:00.000Z",
        message: null,
        mode: "countdown",
      })
    ).toBe(HOLDING_PAGE_ROBOTS_HEADER);
  });
});
