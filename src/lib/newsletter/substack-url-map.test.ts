import { describe, expect, test } from "bun:test";

import { validateSubstackUrlMapStructure } from "@/lib/newsletter/substack-url-map";

describe("validateSubstackUrlMapStructure", () => {
  test("accepts valid map with fallback", () => {
    const map = validateSubstackUrlMapStructure({
      fallbackDestination: "/journal",
      mappings: [
        {
          destination: "/journal/example-post",
          source: "/p/example-post",
        },
      ],
    });

    expect(map.mappings).toHaveLength(1);
    expect(map.fallbackDestination).toBe("/journal");
  });

  test("accepts empty mappings", () => {
    const map = validateSubstackUrlMapStructure({
      fallbackDestination: "/journal",
      mappings: [],
    });

    expect(map.mappings).toEqual([]);
  });

  test("rejects duplicate sources", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [
          { destination: "/journal/a", source: "/p/a" },
          { destination: "/journal/b", source: "/p/a" },
        ],
      })
    ).toThrow("duplicate source /p/a");
  });

  test("rejects non-path source", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [{ destination: "/journal/a", source: "p/a" }],
      })
    ).toThrow("source must start with /");
  });

  test("rejects non-path destination", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        mappings: [{ destination: "journal/a", source: "/p/a" }],
      })
    ).toThrow("destination must start with /");
  });

  test("rejects invalid fallback destination", () => {
    expect(() =>
      validateSubstackUrlMapStructure({
        fallbackDestination: "journal",
        mappings: [],
      })
    ).toThrow("fallbackDestination must start with /");
  });

  test("throws SubstackUrlMapError", () => {
    expect(() => validateSubstackUrlMapStructure(null)).toThrow(
      "Substack URL map must be an object"
    );
  });
});
