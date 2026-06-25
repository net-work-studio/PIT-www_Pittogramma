import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";
import type { BOOKSHOPS_QUERY_RESULT } from "@/sanity/types";

type SocialLinksInput = BOOKSHOPS_QUERY_RESULT[number]["socialLinks"];

function getWebsiteUrlFromSocialLinks(
  socialLinks?: SocialLinksInput
): string | undefined {
  const websiteLink = socialLinks?.links?.find(
    (link) => link.platform === "website" && link.url
  );

  return websiteLink?.url;
}

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

export function buildHrefFromSocialLinks(
  socialLinks: SocialLinksInput,
  resourceType: string,
  utmSettings: UtmSettings
): string | undefined {
  const url = getWebsiteUrlFromSocialLinks(socialLinks);

  if (!url) {
    return undefined;
  }

  return buildTrackedLink(url, resourceType, utmSettings);
}
