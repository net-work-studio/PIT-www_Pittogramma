import { describe, expect, test } from "bun:test";

import { createRssXml, escapeXml, toRssDate } from "./rss";

describe("RSS helpers", () => {
  test("escapes XML-reserved characters in CMS text", () => {
    expect(escapeXml(`Design < research & "practice"`)).toBe(
      "Design &lt; research &amp; &quot;practice&quot;"
    );
  });

  test("formats publication dates in RFC 822 form", () => {
    expect(toRssDate("2026-09-01")).toBe("Tue, 01 Sep 2026 00:00:00 GMT");
  });

  test("creates a self-referencing, escaped RSS document", () => {
    const xml = createRssXml({
      channelUrl: "https://pittogramma.xyz/interviews",
      description: "Interviews & conversations",
      feedUrl: "https://pittogramma.xyz/interviews/feed.xml",
      items: [
        {
          authors: ["Alice & Bob"],
          publishedAt: "2026-09-01",
          title: "Design < dialogue",
          updatedAt: "2026-09-02T00:00:00.000Z",
          url: "https://pittogramma.xyz/interviews/design-dialogue",
        },
      ],
      title: "Pittogramma Interviews",
    });

    expect(xml).toContain('rel="self"');
    expect(xml).toContain("Design &lt; dialogue");
    expect(xml).toContain("Alice &amp; Bob");
  });
});
