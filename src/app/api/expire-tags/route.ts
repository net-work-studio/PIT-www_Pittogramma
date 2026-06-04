import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isValidRevalidateSecret, parseSyncTagsBody } from "./expire-tags";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const FETCH_SYNC_TAGS_TAG = "sanity:fetch-sync-tags";

export async function POST(request: Request) {
  if (!isValidRevalidateSecret(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { headers: NO_STORE_HEADERS, status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  let syncTags: string[];
  try {
    syncTags = parseSyncTagsBody(body);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid syncTags payload",
      },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  for (const tag of syncTags) {
    revalidateTag(tag, "max");
  }
  revalidateTag(FETCH_SYNC_TAGS_TAG, "max");

  return NextResponse.json(
    { revalidated: syncTags.length },
    { headers: NO_STORE_HEADERS }
  );
}
