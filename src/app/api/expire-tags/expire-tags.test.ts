import { afterEach, describe, expect, test } from "bun:test";
import {
  isValidRevalidateSecret,
  normalizeSyncTag,
  parseSyncTagsBody,
} from "./expire-tags";

const originalSecret = process.env.SANITY_REVALIDATE_SECRET;

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.SANITY_REVALIDATE_SECRET;
    return;
  }
  process.env.SANITY_REVALIDATE_SECRET = originalSecret;
});

describe("isValidRevalidateSecret", () => {
  test("rejects missing secret", () => {
    delete process.env.SANITY_REVALIDATE_SECRET;

    const request = new Request("https://pittogramma.com/api/expire-tags", {
      headers: { Authorization: "Bearer test" },
      method: "POST",
    });

    expect(isValidRevalidateSecret(request)).toBe(false);
  });

  test("rejects invalid secret", () => {
    process.env.SANITY_REVALIDATE_SECRET = "expected";

    const request = new Request("https://pittogramma.com/api/expire-tags", {
      headers: { Authorization: "Bearer wrong" },
      method: "POST",
    });

    expect(isValidRevalidateSecret(request)).toBe(false);
  });

  test("accepts valid bearer secret", () => {
    process.env.SANITY_REVALIDATE_SECRET = "expected";

    const request = new Request("https://pittogramma.com/api/expire-tags", {
      headers: { Authorization: "Bearer expected" },
      method: "POST",
    });

    expect(isValidRevalidateSecret(request)).toBe(true);
  });
});

describe("parseSyncTagsBody", () => {
  test("parses valid syncTags", () => {
    const tags = parseSyncTagsBody({ syncTags: ["s1:abc", "s2:def"] });

    expect(tags.length).toBe(2);
    expect(tags[0]).toBe("sanity:s1:abc");
    expect(tags[1]).toBe("sanity:s2:def");
  });

  test.each<[string, unknown]>([
    ["missing body", undefined],
    ["non-array", { syncTags: "s1:abc" }],
    ["empty array", { syncTags: [] }],
    ["non-string tag", { syncTags: ["s1:abc", 123] }],
    ["empty tag", { syncTags: [" "] }],
    ["oversized tag", { syncTags: ["x".repeat(513)] }],
    ["oversized array", { syncTags: Array.from({ length: 201 }, () => "x") }],
  ])("rejects %s", ([, body]) => {
    let didThrow = false;
    try {
      parseSyncTagsBody(body);
    } catch {
      didThrow = true;
    }
    expect(didThrow).toBe(true);
  });
});

describe("normalizeSyncTag", () => {
  test("prefixes tags exactly once", () => {
    expect(normalizeSyncTag("s1:abc")).toBe("sanity:s1:abc");
    expect(normalizeSyncTag("sanity:s1:abc")).toBe("sanity:s1:abc");
  });

  test("rejects invalid tags", () => {
    expect(normalizeSyncTag(" ")).toBeNull();
    expect(normalizeSyncTag("x".repeat(513))).toBeNull();
  });
});
