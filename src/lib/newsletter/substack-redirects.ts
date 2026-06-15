import substackUrlMap from "../../../data/substack-url-map.json";

interface SubstackUrlMapping {
  destination: string;
  note?: string;
  source: string;
}

interface SubstackUrlMapFile {
  fallbackDestination?: string;
  mappings: SubstackUrlMapping[];
}

export function getSubstackRedirects(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  const map = substackUrlMap as SubstackUrlMapFile;
  const redirects = map.mappings
    .filter(
      (entry) =>
        entry.source.startsWith("/") && entry.destination.startsWith("/")
    )
    .map((entry) => ({
      source: entry.source,
      destination: entry.destination,
      permanent: true,
    }));

  if (map.fallbackDestination?.startsWith("/")) {
    redirects.push({
      source: "/p/:slug",
      destination: map.fallbackDestination,
      permanent: false,
    });
  }

  return redirects;
}
