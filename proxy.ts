import { NextResponse } from "next/server";

import { getPublicSiteRobotsHeader } from "./src/lib/public-site-robots";
import {
  getPublicSiteState,
  type PublicSiteSettings,
} from "./src/lib/public-site-state";
import { client } from "./src/sanity/lib/client";
import { PUBLIC_SITE_STATE_QUERY } from "./src/sanity/lib/queries";

const CACHE_TTL_MS = 10_000;

let cachedState: ReturnType<typeof getPublicSiteState> | undefined;
let cacheExpiresAt = 0;

export async function proxy() {
  const response = NextResponse.next();
  const robots = getPublicSiteRobotsHeader(await getCurrentPublicSiteState());

  if (robots) {
    response.headers.set("X-Robots-Tag", robots);
  }

  return response;
}

async function getCurrentPublicSiteState() {
  if (process.env.PUBLIC_SITE_MODE_BYPASS === "true") {
    return { mode: "live" } as const;
  }

  if (cachedState && cacheExpiresAt > Date.now()) {
    return cachedState;
  }

  try {
    const settings = await client.fetch<PublicSiteSettings | null>(
      PUBLIC_SITE_STATE_QUERY
    );
    cachedState = getPublicSiteState(settings);
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  } catch {
    cachedState ??= { mode: "live" };
  }

  return cachedState;
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|icon0.svg|icon1.png|apple-icon.png|manifest.json|robots.txt|sitemap.xml|.*\\.(?:css|ico|jpg|jpeg|js|map|png|svg|webp)$).*)",
  ],
};
