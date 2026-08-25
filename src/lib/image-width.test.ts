import { describe, expect, test } from "bun:test";
import {
  getSafeImageWidth,
  shouldBypassImageOptimization,
} from "@/lib/image-width";

describe("getSafeImageWidth", () => {
  test("does not upscale a source image", () => {
    expect(getSafeImageWidth(1920, 1200)).toBe(1200);
  });

  test("keeps the requested width when source dimensions are unavailable", () => {
    expect(getSafeImageWidth(1920, undefined)).toBe(1920);
  });

  test("bypasses Next optimization when it would upscale the capped source", () => {
    expect(shouldBypassImageOptimization(1920, 1200)).toBe(true);
    expect(shouldBypassImageOptimization(1200, 1200)).toBe(false);
    expect(shouldBypassImageOptimization(1920, undefined)).toBe(false);
  });
});
