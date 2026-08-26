interface PublicSiteSettings {
  countdown?: {
    heading?: string | null;
    launchAt?: string | null;
    message?: string | null;
  } | null;
  maintenance?: {
    contactUrl?: string | null;
    heading?: string | null;
    message?: string | null;
    returnAt?: string | null;
  } | null;
  publicSiteMode?: string | null;
}

type PublicSiteState =
  | { mode: "live" }
  | { mode: "countdown" }
  | { mode: "maintenance" };

const CACHE_TTL_MS = 10_000;
const SANITY_API_VERSION = "2026-06-03";
const PUBLIC_SITE_STATE_QUERY = `
  *[_type == "siteSettings"][0] {
    publicSiteMode,
    countdown { heading, message, launchAt },
    maintenance { heading, message, returnAt, contactUrl }
  }
`;

let cachedState: ReturnType<typeof getPublicSiteState> | undefined;
let cacheExpiresAt = 0;

export default async function publicSiteRobots(
  _request: Request,
  context: { next: () => Promise<Response> }
) {
  const response = await context.next();
  const robots = getPublicSiteRobotsHeader(await getCurrentPublicSiteState());

  if (!robots) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", robots);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

async function getCurrentPublicSiteState() {
  if (cachedState && cacheExpiresAt > Date.now()) {
    return cachedState;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!(projectId && dataset)) {
    return cachedState ?? { mode: "live" };
  }

  try {
    const endpoint = new URL(
      `https://${projectId}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${dataset}`
    );
    endpoint.searchParams.set("query", PUBLIC_SITE_STATE_QUERY);

    const response = await fetch(endpoint);
    if (!response.ok) {
      return cachedState ?? { mode: "live" };
    }

    const payload = (await response.json()) as {
      result: PublicSiteSettings | null;
    };
    cachedState = getPublicSiteState(payload.result);
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  } catch {
    return cachedState ?? { mode: "live" };
  }

  return cachedState;
}

function getPublicSiteRobotsHeader(state: PublicSiteState): string | null {
  return state.mode === "live" ? null : "noindex, nofollow";
}

function getPublicSiteState(
  settings: PublicSiteSettings | null | undefined,
  now = new Date()
): PublicSiteState {
  if (
    settings?.publicSiteMode === "countdown" &&
    settings.countdown?.heading &&
    settings.countdown.launchAt
  ) {
    return new Date(settings.countdown.launchAt).getTime() <= now.getTime()
      ? { mode: "live" }
      : { mode: "countdown" };
  }

  if (
    settings?.publicSiteMode === "maintenance" &&
    settings.maintenance?.heading &&
    settings.maintenance.message
  ) {
    return { mode: "maintenance" };
  }

  return { mode: "live" };
}

export const config = {
  excludedPath: [
    "/_next/*",
    "/admin/*",
    "/api/*",
    "/favicon.ico",
    "/icon0.svg",
    "/icon1.png",
    "/apple-icon.png",
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
  ],
  path: "/*",
};
