import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import { NextResponse } from "next/server";

const MAX_URL_LENGTH = 2048;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const IPV4_MAPPED_DOTTED_REGEX = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i;
const IPV4_MAPPED_HEX_REGEX = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const TRAILING_DOT_REGEX = /\.$/;

export const IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const blockedAddressRanges = new BlockList();

blockedAddressRanges.addSubnet("0.0.0.0", 8, "ipv4");
blockedAddressRanges.addSubnet("10.0.0.0", 8, "ipv4");
blockedAddressRanges.addSubnet("100.64.0.0", 10, "ipv4");
blockedAddressRanges.addSubnet("127.0.0.0", 8, "ipv4");
blockedAddressRanges.addSubnet("169.254.0.0", 16, "ipv4");
blockedAddressRanges.addSubnet("172.16.0.0", 12, "ipv4");
blockedAddressRanges.addSubnet("192.0.0.0", 24, "ipv4");
blockedAddressRanges.addSubnet("192.0.2.0", 24, "ipv4");
blockedAddressRanges.addSubnet("192.168.0.0", 16, "ipv4");
blockedAddressRanges.addSubnet("198.18.0.0", 15, "ipv4");
blockedAddressRanges.addSubnet("198.51.100.0", 24, "ipv4");
blockedAddressRanges.addSubnet("203.0.113.0", 24, "ipv4");
blockedAddressRanges.addSubnet("224.0.0.0", 4, "ipv4");
blockedAddressRanges.addSubnet("240.0.0.0", 4, "ipv4");

blockedAddressRanges.addAddress("::", "ipv6");
blockedAddressRanges.addAddress("::1", "ipv6");
blockedAddressRanges.addSubnet("64:ff9b::", 96, "ipv6");
blockedAddressRanges.addSubnet("100::", 64, "ipv6");
blockedAddressRanges.addSubnet("2001::", 32, "ipv6");
blockedAddressRanges.addSubnet("2001:db8::", 32, "ipv6");
blockedAddressRanges.addSubnet("2002::", 16, "ipv6");
blockedAddressRanges.addSubnet("fc00::", 7, "ipv6");
blockedAddressRanges.addSubnet("fe80::", 10, "ipv6");
blockedAddressRanges.addSubnet("ff00::", 8, "ipv6");

export class OutboundFetchError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OutboundFetchError";
    this.status = status;
  }
}

interface ValidateUrlOptions {
  allowedHostnames?: string[];
  httpsOnly?: boolean;
}

interface FetchWithSafeRedirectsOptions extends ValidateUrlOptions {
  fetcher?: typeof fetch;
  maxRedirects?: number;
  timeoutMs?: number;
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    { headers: { "Cache-Control": "no-store" }, status }
  );
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(TRAILING_DOT_REGEX, "");
}

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    try {
      origins.add(new URL(process.env.NEXT_PUBLIC_BASE_URL).origin);
    } catch {
      // Ignore invalid deployment configuration and keep checking other origins.
    }
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return origins;
}

function isBlockedHostname(hostname: string): boolean {
  return (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  );
}

function isBlockedAddress(address: string): boolean {
  const mappedIpv4 = getMappedIpv4Address(address);
  if (mappedIpv4) {
    return isBlockedAddress(mappedIpv4);
  }

  const version = isIP(address);

  if (version === 4) {
    return blockedAddressRanges.check(address, "ipv4");
  }

  if (version === 6) {
    return blockedAddressRanges.check(address, "ipv6");
  }

  return false;
}

function getMappedIpv4Address(address: string): string | null {
  const dottedMatch = address.match(IPV4_MAPPED_DOTTED_REGEX);
  if (dottedMatch) {
    return dottedMatch[1];
  }

  const hexMatch = address.match(IPV4_MAPPED_HEX_REGEX);
  if (!hexMatch) {
    return null;
  }

  const high = Number.parseInt(hexMatch[1], 16);
  const low = Number.parseInt(hexMatch[2], 16);

  return [
    Math.floor(high / 256),
    high % 256,
    Math.floor(low / 256),
    low % 256,
  ].join(".");
}

async function validateResolvedAddresses(hostname: string): Promise<void> {
  const addressVersion = isIP(hostname);

  if (addressVersion !== 0) {
    if (isBlockedAddress(hostname)) {
      throw new OutboundFetchError("URL hostname is not allowed", 400);
    }
    return;
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new OutboundFetchError("URL hostname could not be resolved", 400);
  }

  if (addresses.length === 0) {
    throw new OutboundFetchError("URL hostname could not be resolved", 400);
  }

  if (addresses.some(({ address }) => isBlockedAddress(address))) {
    throw new OutboundFetchError(
      "URL hostname resolves to a private address",
      400
    );
  }
}

export function assertAllowedOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");

  if (!(origin && getAllowedOrigins().has(origin))) {
    return jsonError("Forbidden", 403);
  }

  return null;
}

export async function readJsonUrl(request: Request): Promise<string> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new OutboundFetchError("Invalid JSON body", 400);
  }

  if (!body || typeof body !== "object" || !("url" in body)) {
    throw new OutboundFetchError("URL is required", 400);
  }

  const url = (body as { url?: unknown }).url;

  if (typeof url !== "string" || url.trim() === "") {
    throw new OutboundFetchError("URL is required", 400);
  }

  if (url.length > MAX_URL_LENGTH) {
    throw new OutboundFetchError("URL is too long", 400);
  }

  return url;
}

export async function validatePublicHttpUrl(
  input: string,
  options: ValidateUrlOptions = {}
): Promise<URL> {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new OutboundFetchError(
      "Invalid URL format. Must be a valid HTTP(S) URL.",
      400
    );
  }

  if (url.username || url.password) {
    throw new OutboundFetchError("URL credentials are not allowed", 400);
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new OutboundFetchError("Invalid URL protocol", 400);
  }

  if (options.httpsOnly && url.protocol !== "https:") {
    throw new OutboundFetchError("Only HTTPS URLs are allowed", 400);
  }

  const hostname = normalizeHostname(url.hostname);

  if (isBlockedHostname(hostname)) {
    throw new OutboundFetchError("URL hostname is not allowed", 400);
  }

  if (
    options.allowedHostnames &&
    !options.allowedHostnames.map(normalizeHostname).includes(hostname)
  ) {
    throw new OutboundFetchError("Invalid URL hostname", 400);
  }

  await validateResolvedAddresses(hostname);

  return url;
}

export async function fetchWithSafeRedirects(
  url: URL,
  init: RequestInit = {},
  options: FetchWithSafeRedirectsOptions = {}
): Promise<Response> {
  const fetcher = options.fetcher ?? fetch;
  const maxRedirects = options.maxRedirects ?? 3;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const visitedUrls = new Set<string>();
  let currentUrl = url;

  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    currentUrl = await validatePublicHttpUrl(currentUrl.href, options);

    if (visitedUrls.has(currentUrl.href)) {
      throw new OutboundFetchError("Redirect loop detected", 400);
    }
    visitedUrls.add(currentUrl.href);

    let response: Response;
    try {
      response = await fetcher(currentUrl, {
        ...init,
        cache: "no-store",
        redirect: "manual",
        signal: init.signal ?? AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new OutboundFetchError("Upstream request timed out", 504);
      }
      throw new OutboundFetchError("Upstream fetch failed", 502);
    }

    if (!REDIRECT_STATUSES.has(response.status)) {
      return response;
    }

    const location = response.headers.get("location");
    if (!location) {
      return response;
    }

    if (redirects === maxRedirects) {
      throw new OutboundFetchError("Too many redirects", 400);
    }

    currentUrl = new URL(location, currentUrl);
  }

  throw new OutboundFetchError("Too many redirects", 400);
}

export async function readLimitedText(
  response: Response,
  maxBytes: number
): Promise<string> {
  const contentLength = response.headers.get("content-length");
  if (contentLength && Number.parseInt(contentLength, 10) > maxBytes) {
    throw new OutboundFetchError("Response too large", 413);
  }

  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    bytesRead += value.byteLength;
    if (bytesRead > maxBytes) {
      await reader.cancel();
      throw new OutboundFetchError("Response too large", 413);
    }

    chunks.push(decoder.decode(value, { stream: true }));
  }

  chunks.push(decoder.decode());

  return chunks.join("");
}

export async function buildBinaryResponse(
  response: Response,
  maxBytes: number
): Promise<NextResponse> {
  const contentLength = response.headers.get("content-length");
  if (contentLength && Number.parseInt(contentLength, 10) > maxBytes) {
    throw new OutboundFetchError("Response too large", 413);
  }

  if (!response.body) {
    throw new OutboundFetchError("Empty upstream response", 502);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    bytesRead += value.byteLength;
    if (bytesRead > maxBytes) {
      await reader.cancel();
      throw new OutboundFetchError("Response too large", 413);
    }

    chunks.push(value);
  }

  return new NextResponse(Buffer.concat(chunks), {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type":
        response.headers.get("content-type") ?? "application/octet-stream",
    },
  });
}

export function isAllowedImageContentType(contentType: string): boolean {
  const [type] = contentType.toLowerCase().split(";");
  return IMAGE_CONTENT_TYPES.has(type.trim());
}
