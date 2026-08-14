export interface JournalFootnote {
  _key: string;
  note: string;
  url?: string | null;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

export function getJournalFootnote(value: unknown): JournalFootnote | null {
  const record = getRecord(value);
  if (
    record?._type !== "footnote" ||
    typeof record._key !== "string" ||
    typeof record.note !== "string" ||
    record.note.trim().length === 0
  ) {
    return null;
  }

  return {
    _key: record._key,
    note: record.note,
    url: typeof record.url === "string" ? record.url : null,
  };
}

function getFootnoteMarks(value: unknown): string[] {
  const marks = getRecord(value)?.marks;
  return Array.isArray(marks)
    ? marks.filter((mark): mark is string => typeof mark === "string")
    : [];
}

function getFootnotesInBlock(value: unknown): JournalFootnote[] {
  const block = getRecord(value);
  if (block?._type !== "block" || !Array.isArray(block.children)) {
    return [];
  }

  const footnotesByKey = new Map(
    (Array.isArray(block.markDefs) ? block.markDefs : [])
      .map(getJournalFootnote)
      .filter((footnote): footnote is JournalFootnote => footnote !== null)
      .map((footnote) => [footnote._key, footnote])
  );

  return block.children.flatMap((child) =>
    getFootnoteMarks(child)
      .map((mark) => footnotesByKey.get(mark))
      .filter((footnote): footnote is JournalFootnote => footnote !== undefined)
  );
}

export function collectJournalFootnotes(content: unknown): JournalFootnote[] {
  if (!Array.isArray(content)) {
    return [];
  }

  const seenKeys = new Set<string>();
  return content.flatMap(getFootnotesInBlock).filter((footnote) => {
    if (seenKeys.has(footnote._key)) {
      return false;
    }

    seenKeys.add(footnote._key);
    return true;
  });
}

export function JournalFootnotes({
  footnotes,
}: {
  footnotes: JournalFootnote[];
}) {
  if (footnotes.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="footnotes-heading"
      className="mx-auto mt-16 max-w-175 border-t pt-4"
    >
      <h2
        className="mb-4 font-mono text-muted-foreground text-xs uppercase"
        id="footnotes-heading"
      >
        Footnotes
      </h2>
      <ol className="flex list-decimal flex-col gap-4 pl-5">
        {footnotes.map((footnote, index) => {
          const number = index + 1;
          return (
            <li
              className="scroll-mt-24 pl-1 text-sm leading-relaxed"
              id={`footnote-${number}`}
              key={footnote._key}
              role="doc-endnote"
            >
              <span className="whitespace-pre-wrap">{footnote.note}</span>
              {footnote.url ? (
                <a
                  className="ml-2 underline underline-offset-2"
                  href={footnote.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Source
                </a>
              ) : null}
              <a
                aria-label={`Back to footnote ${number} reference`}
                className="ml-2 font-mono text-xs underline underline-offset-2"
                href={`#footnote-ref-${number}`}
              >
                ↩
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
