import { NextResponse } from "next/server";
import {
  assertSanityProjectUser,
  fetchWithSafeRedirects,
  isAllowedHtmlContentType,
  OutboundFetchError,
  readJsonUrl,
  readLimitedText,
  validatePublicHttpUrl,
} from "../../_utils/outbound-fetch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_HTML_SIZE = 1024 * 1024;

// Regex patterns to extract OG meta tags
const OG_TITLE_REGEX =
  /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i;
const OG_TITLE_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i;
const OG_DESCRIPTION_REGEX =
  /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i;
const OG_DESCRIPTION_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i;
const OG_SITE_NAME_REGEX =
  /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i;
const OG_SITE_NAME_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i;
const OG_IMAGE_REGEX =
  /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i;
const OG_IMAGE_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i;
const TITLE_TAG_REGEX = /<title[^>]*>([^<]+)<\/title>/i;
const META_DESCRIPTION_REGEX =
  /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i;
const META_DESCRIPTION_REVERSE_REGEX =
  /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i;

function extractMeta(
  html: string,
  regex: RegExp,
  reverseRegex: RegExp
): string | null {
  const match = html.match(regex) || html.match(reverseRegex);
  return match ? decodeHtmlEntities(match[1]) : null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

export interface OgData {
  description: string | null;
  imageUrl: string | null;
  siteName: string | null;
  title: string | null;
}

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
    { error: "Failed to fetch page data" },
    { headers: { "Cache-Control": "no-store" }, status: 502 }
  );
}

function parseOgData(html: string, baseUrl: string): OgData {
  const ogTitle = extractMeta(html, OG_TITLE_REGEX, OG_TITLE_REVERSE_REGEX);
  const ogDescription = extractMeta(
    html,
    OG_DESCRIPTION_REGEX,
    OG_DESCRIPTION_REVERSE_REGEX
  );
  const ogSiteName = extractMeta(
    html,
    OG_SITE_NAME_REGEX,
    OG_SITE_NAME_REVERSE_REGEX
  );
  let ogImage = extractMeta(html, OG_IMAGE_REGEX, OG_IMAGE_REVERSE_REGEX);

  // Fallback to regular title and description if OG tags not found
  const titleTag = html.match(TITLE_TAG_REGEX);
  const metaDescription = extractMeta(
    html,
    META_DESCRIPTION_REGEX,
    META_DESCRIPTION_REVERSE_REGEX
  );

  // Resolve relative image URLs
  if (ogImage && !ogImage.startsWith("http")) {
    try {
      ogImage = new URL(ogImage, baseUrl).href;
    } catch {
      ogImage = null;
    }
  }

  return {
    title:
      ogTitle || (titleTag ? decodeHtmlEntities(titleTag[1].trim()) : null),
    description: ogDescription || metaDescription,
    siteName: ogSiteName,
    imageUrl: ogImage,
  };
}

export async function POST(request: Request) {
  const authError = await assertSanityProjectUser(request);
  if (authError) {
    return authError;
  }

  try {
    const targetUrl = await readJsonUrl(request);
    const parsedUrl = await validatePublicHttpUrl(targetUrl);
    const response = await fetchWithSafeRedirects(
      parsedUrl,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
      },
      {
        maxRedirects: 3,
        timeoutMs: 10_000,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { headers: { "Cache-Control": "no-store" }, status: 502 }
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && !isAllowedHtmlContentType(contentType)) {
      return NextResponse.json(
        { error: "URL does not point to an HTML document" },
        { headers: { "Cache-Control": "no-store" }, status: 400 }
      );
    }

    const html = await readLimitedText(response, MAX_HTML_SIZE);
    const ogData = parseOgData(html, response.url || parsedUrl.href);

    if (!(ogData.title || ogData.siteName)) {
      return NextResponse.json(
        { error: "No OG tags or title found on this page" },
        { headers: { "Cache-Control": "no-store" }, status: 404 }
      );
    }

    return NextResponse.json(ogData, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
