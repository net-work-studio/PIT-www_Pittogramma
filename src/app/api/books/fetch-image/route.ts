import { NextResponse } from "next/server";

// Allowed Google Books image hostnames
const ALLOWED_HOSTNAMES = [
  "books.google.com",
  "books.google.it",
  "books.googleapis.com",
];

// In-memory rate limiter - resets on restart, doesn't share state across serverless instances.
// Acceptable here since this API is only used for backend updates, not high-frequency calls.
// For production-scale use, consider Upstash Redis or Vercel KV.
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
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
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    // Validate URL is from allowed Google Books hostnames (exact match prevents subdomain attacks)
    const url = new URL(imageUrl);
    if (!ALLOWED_HOSTNAMES.includes(url.hostname)) {
      return NextResponse.json(
        { error: "Invalid image source" },
        { status: 400 }
      );
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
