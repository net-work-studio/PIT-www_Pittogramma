import { type NextRequest, NextResponse } from "next/server";
import {
  assertAllowedOrigin,
  OutboundFetchError,
  readJsonStringField,
} from "@/app/api/_utils/outbound-fetch";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "Pittogramma/1.0 (https://pittogramma.com)";
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Simple in-memory rate limiter: 1 request per second
let lastRequestTime = 0;

export async function POST(request: NextRequest) {
  const originError = assertAllowedOrigin(request);
  if (originError) {
    return originError;
  }

  let query: string;
  try {
    query = await readJsonStringField(request, "query", {
      maxLength: 256,
      message: "Query must be at least 2 characters",
    });
  } catch (error) {
    if (error instanceof OutboundFetchError) {
      return NextResponse.json(
        { error: error.message },
        { headers: NO_STORE_HEADERS, status: error.status }
      );
    }
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  if (query.trim().length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { headers: NO_STORE_HEADERS, status: 400 }
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
      cache: "no-store",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Nominatim" },
        { headers: NO_STORE_HEADERS, status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Geocoding request timed out" },
        { headers: NO_STORE_HEADERS, status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to connect to geocoding service" },
      { headers: NO_STORE_HEADERS, status: 502 }
    );
  }
}
