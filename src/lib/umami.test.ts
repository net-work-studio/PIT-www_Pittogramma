import { describe, expect, test } from "bun:test";

import { shouldTrackWithUmami } from "./umami";

describe("Umami tracking", () => {
  test("tracks every configured public frontend state", () => {
    expect(
      shouldTrackWithUmami({
        isDraftMode: false,
        websiteId: "website-id",
      })
    ).toBe(true);
  });

  test("does not track Sanity draft mode", () => {
    expect(
      shouldTrackWithUmami({
        isDraftMode: true,
        websiteId: "website-id",
      })
    ).toBe(false);
  });

  test("does not track without a website ID", () => {
    expect(
      shouldTrackWithUmami({
        isDraftMode: false,
        websiteId: undefined,
      })
    ).toBe(false);
  });
});
