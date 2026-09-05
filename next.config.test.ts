import { describe, expect, test } from "bun:test";
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";

import nextConfig from "./next.config";

describe("Umami proxy rewrites", () => {
  test.each([
    [
      "tracker script",
      "https://pittogramma.xyz/assets/p.js",
      "https://umami.net-work.studio/script.js",
    ],
    [
      "collection endpoint",
      "https://pittogramma.xyz/p/api/send",
      "https://umami.net-work.studio/api/send",
    ],
  ])("proxies the %s through the public site", async (_, url, destination) => {
    const response = await unstable_getResponseFromNextConfig({
      nextConfig,
      url,
    });

    expect(response.headers.get("x-middleware-rewrite")).toBe(destination);
  });
});
