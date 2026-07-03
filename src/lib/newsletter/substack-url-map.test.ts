import { describe, expect, test } from "bun:test";

import {
  SubstackUrlMapError,
  validateSubstackUrlMapStructure,
} from "@/lib/newsletter/substack-url-map";

describe("validateSubstackUrlMapStructure", () => {
  test("accepts valid map with fallback", () => {
    const map = validateSubstackUrlMapStructure({
      mappings: [
        {
          source: "/p/example-post",
          destination: "/journal/example-post",
        },
      ],
      fallbackDestination: "/journal",
    });

    expect(map.mappings).toHaveLength(1);
    expect(map.fallbackDestination).toBe("/journal");
  });

  test("accepts empty mappings", () => {
    const map = validateSubstackUrlMapStructure({
      mappings: [],
      fallbackDestination: "/journal",
    });

    expect(map.mappings).toEqual([]);
  });

  test("rejects duplicate sources", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [
          { source: "/p/a", destination: "/journal/a" },
          { source: "/p/a", destination: "/journal/b" },
        ],
      })
    ).toThrow("duplicate source /p/a");
  });

  test("rejects non-path source", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [{ source: "p/a", destination: "/journal/a" }],
      })
    ).toThrow("source must start with /");
  });

  test("rejects non-path destination", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [{ source: "/p/a", destination: "journal/a" }],
      })
    ).toThrow("destination must start with /");
  });

  test("rejects invalid fallback destination", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [],
        fallbackDestination: "journal",
      })
    ).toThrow("fallbackDestination must start with /");
  });

  test("throws SubstackUrlMapError", () => {
    try {
      validateSubstackUrlMapStructure(null);
    } catch (error) {
      expect(error).toBeInstanceOf(SubstackUrlMapError);
    }
  });
});
