import { describe, expect, it } from "bun:test";
import { calculateInterviewReadingTime } from "./interview-reading-time";

describe("calculateInterviewReadingTime", () => {
  it("counts the intro, portable text, and media captions", () => {
    const readingTime = calculateInterviewReadingTime({
      interview: [
        {
          _type: "block",
          children: [{ _key: "answer", _type: "span", text: "One" }],
        },
        {
          _type: "singleMediaBlock",
          media: {
            alt: "This does not count",
            caption: "Caption",
          },
        },
      ],
      introText: Array.from({ length: 199 }, () => "word").join(" "),
    });

    expect(readingTime).toBe(2);
  });

  it("rounds every non-empty estimate up at 200 words per minute", () => {
    const introText = Array.from({ length: 201 }, () => "word").join(" ");

    expect(calculateInterviewReadingTime({ introText })).toBe(2);
  });

  it("does not create an estimate without readable text", () => {
    expect(
      calculateInterviewReadingTime({
        interview: [
          {
            _type: "singleMediaBlock",
            media: { alt: "Image description" },
          },
        ],
      })
    ).toBeUndefined();
  });
});
