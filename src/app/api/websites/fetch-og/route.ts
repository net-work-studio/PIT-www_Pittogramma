import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }
  record.count++;
  return false;
}

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
  title: string | null;
  description: string | null;
  siteName: string | null;
  imageUrl: string | null;
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

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format. Must be a valid HTTP(S) URL." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 502 }
      );
    }

    const contentLength = response.headers.get("content-length");
    const MAX_HTML_SIZE = 5 * 1024 * 1024; // 5MB
    if (contentLength && parseInt(contentLength) > MAX_HTML_SIZE) {
      return NextResponse.json(
        { error: "Response too large" },
        { status: 502 }
      );
    }

    const html = await response.text();
    const ogData = parseOgData(html, parsedUrl.origin);

    if (!(ogData.title || ogData.siteName)) {
      return NextResponse.json(
        { error: "No OG tags or title found on this page" },
        { status: 404 }
      );
    }

    return NextResponse.json(ogData);
  } catch (error) {
    console.error("Error fetching OG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch page data" },
      { status: 500 }
    );
  }
}
