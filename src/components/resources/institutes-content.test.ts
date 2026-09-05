import { describe, expect, test } from "bun:test";
import type { INSTITUTES_QUERY_RESULT } from "@/sanity/types";
import { getInstituteMarkers } from "@/lib/institute-map-markers";

describe("getInstituteMarkers", () => {
  test("omits an institute without a place while retaining mapped institutes", () => {
    const institutes = [
      { _id: "unmapped", name: "Unmapped Institute", place: null },
      {
        _id: "mapped",
        name: "Mapped Institute",
        place: { lat: 46.2, lng: 6.1 },
      },
    ] as INSTITUTES_QUERY_RESULT;

    expect(getInstituteMarkers(institutes)).toEqual([
      { id: "mapped", lat: 46.2, lng: 6.1, name: "Mapped Institute" },
    ]);
  });
});
