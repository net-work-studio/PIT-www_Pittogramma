/**
 * Resolves internal document references to their frontend URLs
 */

interface InternalLinkDoc {
  _type: string;
  slug?: { current: string } | null;
}

const ROUTE_MAP: Record<string, string> = {
  project: "/projects",
  interview: "/interviews",
  journal: "/journal",
  person: "/designers",
  event: "/events",
  edition: "/editions",
  // Singleton pages
  homePage: "/",
  projectsPage: "/projects",
  interviewsPage: "/interviews",
  designersPage: "/designers",
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
  if (
    ["homePage", "projectsPage", "interviewsPage", "designersPage"].includes(
      doc._type
    )
  ) {
    return basePath;
  }

  // Document types with slugs
  if (!doc.slug?.current) {
    return null;
  }
  return `${basePath}/${doc.slug.current}`;
}
