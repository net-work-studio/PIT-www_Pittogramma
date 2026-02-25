import { type NextRequest, NextResponse } from "next/server";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "Pittogramma/1.0 (https://pittogramma.com)";

// Simple in-memory rate limiter: 1 request per second
let lastRequestTime = 0;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  // Enforce Nominatim rate limit: 1 request per second
  const now = Date.now();
  const nextAllowed = lastRequestTime + 1000;
  const sendTime = Math.max(now, nextAllowed);
  lastRequestTime = sendTime;
  if (sendTime > now) {
    await new Promise((resolve) => setTimeout(resolve, sendTime - now));
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", query.trim());
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("accept-language", "en");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Nominatim" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to geocoding service" },
      { status: 502 }
    );
  }
}
