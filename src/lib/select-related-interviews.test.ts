import { expect, test } from "bun:test";

import { selectRelatedInterviews } from "./select-related-interviews";

test("keeps tag-related interviews first and fills the remaining cards", () => {
  expect(
    selectRelatedInterviews({
      fallbackInterviews: [{ _id: "fallback-1" }, { _id: "fallback-2" }],
      random: () => 0,
      relatedInterviews: [{ _id: "related-1" }, { _id: "related-2" }],
    }).map((interview) => interview._id)
  ).toEqual(["related-1", "related-2", "fallback-1", "fallback-2"]);
});

test("returns fewer than four interviews when there are not enough alternatives", () => {
  expect(
    selectRelatedInterviews({
      fallbackInterviews: [{ _id: "fallback-1" }],
      relatedInterviews: [{ _id: "related-1" }],
    }).map((interview) => interview._id)
  ).toEqual(["related-1", "fallback-1"]);
});

test("limits recommendations to four tag-related interviews", () => {
  expect(
    selectRelatedInterviews({
      relatedInterviews: [
        { _id: "related-1" },
        { _id: "related-2" },
        { _id: "related-3" },
        { _id: "related-4" },
        { _id: "related-5" },
      ],
    }).map((interview) => interview._id)
  ).toEqual(["related-1", "related-2", "related-3", "related-4"]);
});
