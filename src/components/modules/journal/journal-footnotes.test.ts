import { describe, expect, it } from "bun:test";
import { collectJournalFootnotes } from "./journal-footnotes";

describe("collectJournalFootnotes", () => {
  it("collects only used footnotes in reading order", () => {
    const footnotes = collectJournalFootnotes([
      {
        _type: "block",
        children: [
          { _type: "span", marks: ["second"] },
          { _type: "span", marks: ["first", "second"] },
        ],
        markDefs: [
          { _key: "first", _type: "footnote", note: "First note" },
          { _key: "second", _type: "footnote", note: "Second note" },
          { _key: "unused", _type: "footnote", note: "Unused note" },
        ],
      },
      {
        _type: "block",
        children: [{ _type: "span", marks: ["third"] }],
        markDefs: [
          {
            _key: "third",
            _type: "footnote",
            note: "Third note",
            url: "https://example.com/source",
          },
        ],
      },
    ]);

    expect(footnotes).toEqual([
      { _key: "second", note: "Second note", url: null },
      { _key: "first", note: "First note", url: null },
      {
        _key: "third",
        note: "Third note",
        url: "https://example.com/source",
      },
    ]);
  });
});
