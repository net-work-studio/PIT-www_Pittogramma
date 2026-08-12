/**
 * Resolves internal document references to their frontend URLs
 */

import { RESOURCE_PAGE_ROUTES } from "@/lib/resource-page";

interface InternalLinkDoc {
  _type: string;
  slug?: { current: string } | null;
}

const SINGLETON_PAGE_ROUTES: Record<string, string> = {
  designersPage: "/designers",
  homePage: "/",
  interviewsPage: "/interviews",
  projectsPage: "/projects",
  ...RESOURCE_PAGE_ROUTES,
};

const ROUTE_MAP: Record<string, string> = {
  edition: "/editions",
  event: "/events",
  interview: "/interviews",
  journal: "/journal",
  person: "/designers",
  project: "/projects",
  ...SINGLETON_PAGE_ROUTES,
};

/**
 * Resolves a Sanity document reference to its frontend URL
 */
export function resolveInternalLink(
  doc: InternalLinkDoc | null | undefined
): string | null {
  if (!doc?._type) {
    return null;
  }

  const basePath = ROUTE_MAP[doc._type];
  if (!basePath) {
    return null;
  }

  // Singleton pages don't need a slug
  if (doc._type in SINGLETON_PAGE_ROUTES) {
    return basePath;
  }

  // Document types with slugs
  if (!doc.slug?.current) {
    return null;
  }
  return `${basePath}/${doc.slug.current}`;
}
