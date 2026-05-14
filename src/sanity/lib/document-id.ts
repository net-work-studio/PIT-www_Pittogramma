const DRAFT_ID_PREFIX_REGEX = /^drafts\./;

// Strip the `drafts.` prefix so a document ID can be compared against both
// its published and draft variants when looking for sibling documents.
export function getPublishedId(id: string): string {
  return id.replace(DRAFT_ID_PREFIX_REGEX, "");
}
