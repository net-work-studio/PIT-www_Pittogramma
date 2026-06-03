import { NextResponse } from "next/server";
import {
  assertSanityProjectUser,
  buildBinaryResponse,
  fetchWithSafeRedirects,
  IMAGE_CONTENT_TYPES,
  isAllowedImageContentType,
  OutboundFetchError,
  readJsonUrl,
  validatePublicHttpUrl,
} from "../../_utils/outbound-fetch";

const ALLOWED_HOSTNAMES = [
  "books.google.com",
  "books.google.it",
  "books.googleapis.com",
];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function errorResponse(error: unknown): NextResponse {
  if (error instanceof OutboundFetchError) {
    return NextResponse.json(
      { error: error.message },
      {
        headers: { "Cache-Control": "no-store" },
        status: error.status,
      }
    );
  }

  return NextResponse.json(
    { error: "Failed to fetch image" },
    { headers: { "Cache-Control": "no-store" }, status: 502 }
  );
}

export async function POST(request: Request) {
  const authError = await assertSanityProjectUser(request);
  if (authError) {
    return authError;
  }

  try {
    const imageUrl = await readJsonUrl(request);
    const url = await validatePublicHttpUrl(imageUrl, {
      allowedHostnames: ALLOWED_HOSTNAMES,
      httpsOnly: true,
    });
    const response = await fetchWithSafeRedirects(
      url,
      {
        headers: {
          Accept: Array.from(IMAGE_CONTENT_TYPES).join(","),
          "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
        },
      },
      {
        allowedHostnames: ALLOWED_HOSTNAMES,
        httpsOnly: true,
        maxRedirects: 3,
        timeoutMs: 10_000,
      }
    );

    if (!response.ok) {
      throw new OutboundFetchError(
        `Failed to fetch image: ${response.status}`,
        502
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!isAllowedImageContentType(contentType)) {
      return NextResponse.json(
        { error: "URL does not point to a supported image" },
        { headers: { "Cache-Control": "no-store" }, status: 400 }
      );
    }

    return await buildBinaryResponse(response, MAX_IMAGE_SIZE);
  } catch (error) {
    return errorResponse(error);
  }
}
