import type { SanityClient } from "sanity";

const DRAFTS_PREFIX = /^drafts\./;

/**
 * Ensure a draft document exists for the given document ID.
 *
 * Studio doesn't auto-create a draft synchronously for custom inputs that
 * patch sibling fields directly via the Sanity client — without a draft,
 * `client.patch(...)` on a brand-new (unsaved) document silently fails with
 * "document not found".
 *
 * Behavior:
 * - If a draft already exists, returns its ID.
 * - If only a published document exists, clones it into a draft (stripping
 *   system metadata) and returns the draft ID.
 * - If neither exists and a `documentType` is provided, creates a minimal
 *   draft shell so the subsequent patch can target it.
 * - If neither exists and no `documentType` is provided, just returns the
 *   draft ID; the caller's patch is expected to be guarded.
 */
export async function ensureDraft(
  client: SanityClient,
  documentId: string,
  documentType?: string
): Promise<string> {
  const publishedId = documentId.replace(DRAFTS_PREFIX, "");
  const draftId = `drafts.${publishedId}`;

  const draft = await client.getDocument(draftId);
  if (draft) {
    return draftId;
  }

  const published = await client.getDocument(publishedId);
  if (published) {
    const { _rev, _createdAt, _updatedAt, ...docData } = published;
    await client.createIfNotExists({ ...docData, _id: draftId });
    return draftId;
  }

  if (documentType) {
    await client.createIfNotExists({ _id: draftId, _type: documentType });
  }

  return draftId;
}
