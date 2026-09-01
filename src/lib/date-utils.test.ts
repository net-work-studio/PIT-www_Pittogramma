import { describe, expect, test } from "bun:test";
import { isPublicationDateReached, isUpcomingEvent } from "@/lib/date-utils";

describe("isPublicationDateReached", () => {
  test("publishes on its scheduled date and keeps future items unavailable", () => {
    expect(isPublicationDateReached("2026-08-24", "2026-08-25")).toBe(true);
    expect(isPublicationDateReached("2026-08-25", "2026-08-25")).toBe(true);
    expect(isPublicationDateReached("2026-08-26", "2026-08-25")).toBe(false);
    expect(isPublicationDateReached(undefined, "2026-08-25")).toBe(false);
  });
});

describe("isUpcomingEvent", () => {
  test("keeps events ending today or in the future homepage-eligible", () => {
    expect(isUpcomingEvent("2026-08-24", "2026-08-25", "2026-08-25")).toBe(
      true
    );
    expect(isUpcomingEvent("2026-08-25", null, "2026-08-25")).toBe(true);
    expect(isUpcomingEvent("2026-08-25", "2026-08-26", "2026-08-25")).toBe(
      true
    );
  });

  test("excludes events that have ended", () => {
    expect(isUpcomingEvent("2026-08-20", "2026-08-24", "2026-08-25")).toBe(
      false
    );
  });
});
