import substackUrlMap from "../../../data/substack-url-map.json";
import { validateSubstackUrlMapStructure } from "./substack-url-map";

export function getSubstackRedirects(): Array<{
  destination: string;
  permanent: boolean;
  source: string;
}> {
  const map = validateSubstackUrlMapStructure(substackUrlMap);
  const redirects = map.mappings.map((entry) => ({
    destination: entry.destination,
    permanent: true,
    source: entry.source,
  }));

  if (map.fallbackDestination) {
    redirects.push({
      destination: map.fallbackDestination,
      permanent: false,
      source: "/p/:slug",
    });
  }

  return redirects;
}
