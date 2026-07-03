import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";

export function buildHrefFromUrl(
  url: string | null | undefined,
  resourceType: string,
  utmSettings: UtmSettings
): string | undefined {
  if (!url) {
    return undefined;
  }

  return buildTrackedLink(url, resourceType, utmSettings);
}
