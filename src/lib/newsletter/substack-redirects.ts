import { validateSubstackUrlMapStructure } from "@/lib/newsletter/substack-url-map";
import substackUrlMap from "../../../data/substack-url-map.json";

export function getSubstackRedirects(): Array<{
  destination: string;
  permanent: boolean;
  source: string;
}> {
  const map = validateSubstackUrlMapStructure(substackUrlMap);
  const redirects = map.mappings.map((entry) => ({
    source: entry.source,
    destination: entry.destination,
    permanent: true,
  }));

  if (map.fallbackDestination) {
    redirects.push({
      source: "/p/:slug",
      destination: map.fallbackDestination,
      permanent: false,
    });
  }

  return redirects;
}
