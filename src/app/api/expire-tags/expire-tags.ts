const MAX_SYNC_TAGS = 200;
const MAX_SYNC_TAG_LENGTH = 512;
const SYNC_TAG_PREFIX = "sanity:";

export function normalizeSyncTag(tag: string): string | null {
  const trimmed = tag.trim();

  if (!(trimmed && trimmed.length <= MAX_SYNC_TAG_LENGTH)) {
    return null;
  }

  return trimmed.startsWith(SYNC_TAG_PREFIX)
    ? trimmed
    : `${SYNC_TAG_PREFIX}${trimmed}`;
}

export function parseSyncTagsBody(body: unknown): string[] {
  if (!body || typeof body !== "object" || !("syncTags" in body)) {
    throw new Error("syncTags must be a non-empty array of strings");
  }

  const syncTags = (body as { syncTags?: unknown }).syncTags;

  if (
    !Array.isArray(syncTags) ||
    syncTags.length === 0 ||
    syncTags.length > MAX_SYNC_TAGS
  ) {
    throw new Error("syncTags must be a non-empty array of strings");
  }

  const normalized = syncTags.map((tag) => {
    if (typeof tag !== "string") {
      return null;
    }
    return normalizeSyncTag(tag);
  });

  if (normalized.some((tag) => tag === null)) {
    throw new Error("syncTags must be non-empty strings");
  }

  return Array.from(new Set(normalized as string[]));
}

export function isValidRevalidateSecret(request: Request): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const authorization = request.headers.get("authorization");

  if (!(secret && authorization)) {
    return false;
  }

  return authorization === `Bearer ${secret}`;
}
