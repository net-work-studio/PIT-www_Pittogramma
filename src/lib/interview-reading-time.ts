const WORDS_PER_MINUTE = 200;

type UnknownRecord = Record<string, unknown>;

interface InterviewReadingTimeInput {
  interview?: unknown;
  introText?: unknown;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function countWords(value: string): number {
  return value.trim().match(/\S+/gu)?.length ?? 0;
}

function getBlockText(block: UnknownRecord): string[] {
  if (block._type !== "block" || !Array.isArray(block.children)) {
    return [];
  }

  return block.children.flatMap((child) => {
    if (!isRecord(child) || typeof child.text !== "string") {
      return [];
    }
    return [child.text];
  });
}

function getMediaCaptions(block: UnknownRecord): string[] {
  const mediaFields = [
    "media",
    "left",
    "center",
    "right",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
  ];

  return mediaFields.flatMap((field) => {
    const media = block[field];
    if (!isRecord(media) || typeof media.caption !== "string") {
      return [];
    }
    return [media.caption];
  });
}

/**
 * Returns the live estimate for an Interview's readable text. It deliberately
 * excludes titles, metadata, alt text, and media without captions.
 */
export function calculateInterviewReadingTime({
  introText,
  interview,
}: InterviewReadingTimeInput): number | undefined {
  const text = [typeof introText === "string" ? introText : ""];

  if (Array.isArray(interview)) {
    for (const item of interview) {
      if (!isRecord(item)) {
        continue;
      }
      text.push(...getBlockText(item), ...getMediaCaptions(item));
    }
  }

  const wordCount = text.reduce((total, value) => total + countWords(value), 0);
  return wordCount > 0 ? Math.ceil(wordCount / WORDS_PER_MINUTE) : undefined;
}
