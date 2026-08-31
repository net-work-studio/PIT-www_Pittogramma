import { describe, expect, test } from "bun:test";
import { sortFeedTimelineItems } from "@/lib/feed-timeline";

interface FeedItem {
  _createdAt: string;
  dateStart: string;
  id: string;
}

describe("sortFeedTimelineItems", () => {
  test("sorts newer start dates before older ones", () => {
    const items: FeedItem[] = [
      {
        _createdAt: "2026-08-20T10:00:00Z",
        dateStart: "2026-08-01",
        id: "old",
      },
      {
        _createdAt: "2026-08-01T10:00:00Z",
        dateStart: "2026-08-20",
        id: "new",
      },
    ];

    expect(
      sortFeedTimelineItems(items, (item) => item).map((item) => item.id)
    ).toEqual(["new", "old"]);
  });

  test("uses CMS creation time to break ties", () => {
    const items: FeedItem[] = [
      {
        _createdAt: "2026-08-20T10:00:00Z",
        dateStart: "2026-08-20",
        id: "older",
      },
      {
        _createdAt: "2026-08-20T12:00:00Z",
        dateStart: "2026-08-20",
        id: "newer",
      },
    ];

    expect(
      sortFeedTimelineItems(items, (item) => item).map((item) => item.id)
    ).toEqual(["newer", "older"]);
  });
});
