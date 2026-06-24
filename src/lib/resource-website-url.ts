import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";

export interface SocialLinksData {
  links?: Array<{
    platform?: string | null;
    url?: string | null;
  } | null> | null;
}

export function getWebsiteUrlFromSocialLinks(
  socialLinks?: SocialLinksData | null
): string | null {
  const websiteLink = socialLinks?.links?.find(
    (link) => link?.platform === "website" && link?.url
  );

  return websiteLink?.url ?? null;
}

export function buildResourceHref(
  url: string | null | undefined,
  resourceType: string,
  utmSettings?: UtmSettings
): string | undefined {
  if (!url) {
    return undefined;
  }

  return buildTrackedLink(url, resourceType, utmSettings);
}
