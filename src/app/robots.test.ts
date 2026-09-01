import { describe, expect, test } from "bun:test";

import robots from "./robots";

describe("robots", () => {
  test("disallows the canonical embedded Studio route", () => {
    const { rules } = robots();

    if (!Array.isArray(rules)) {
      throw new Error("Expected one robots rule per user agent");
    }

    const studioRule = rules.find((rule) => rule.userAgent === "*");
    const disallow = studioRule?.disallow;
    const paths = Array.isArray(disallow) ? disallow : [disallow];

    expect(paths).toContain("/admin");
    expect(paths).toContain("/admin/");
  });
});
