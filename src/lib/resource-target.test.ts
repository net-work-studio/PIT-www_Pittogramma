import { describe, expect, test } from "bun:test";

import {
  buildResourceTargetHref,
  getResourceTargetElementId,
} from "./resource-target";

describe("Resource target URLs", () => {
  test("encodes a document ID in the resource query parameter", () => {
    expect(buildResourceTargetHref("/bookshops", "drafts.bookshop/1")).toBe(
      "/bookshops?resource=drafts.bookshop%2F1"
    );
  });

  test("creates a stable DOM identifier for a document ID", () => {
    expect(getResourceTargetElementId("bookshop-1")).toBe(
      "resource-bookshop-1"
    );
  });
});
