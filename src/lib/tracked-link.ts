import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export interface UtmSettings {
  utmCampaign?: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
}

export function utmSettingsFromSiteSettings(
  settings: SITE_SETTINGS_QUERY_RESULT | null
): UtmSettings {
  return {
    utmCampaign: settings?.utmCampaign,
    utmMedium: settings?.utmMedium,
    utmSource: settings?.utmSource,
  };
}

// Default values used when settings are not provided
const DEFAULT_UTM: Required<UtmSettings> = {
  utmCampaign: "resources",
  utmMedium: "website",
  utmSource: "pittogramma",
};

/**
 * Appends UTM tracking parameters to a URL for referral tracking.
 *
 * @param url - The original URL to add tracking to
 * @param resourceType - The type of resource (book, website, etc.) for utm_content
 * @param settings - Optional UTM settings from site configuration
 * @returns URL with UTM parameters appended
 */
export function buildTrackedLink(
  url: string,
  resourceType?: string,
  settings?: UtmSettings
): string {
  if (!url) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);

    const source = settings?.utmSource ?? DEFAULT_UTM.utmSource;
    const medium = settings?.utmMedium ?? DEFAULT_UTM.utmMedium;
    const campaign = settings?.utmCampaign ?? DEFAULT_UTM.utmCampaign;

    if (source) {
      parsedUrl.searchParams.set("utm_source", source);
    }
    if (medium) {
      parsedUrl.searchParams.set("utm_medium", medium);
    }
    if (campaign) {
      parsedUrl.searchParams.set("utm_campaign", campaign);
    }

    if (resourceType) {
      parsedUrl.searchParams.set("utm_content", resourceType);
    }

    return parsedUrl.toString();
  } catch {
    return url;
  }
}
