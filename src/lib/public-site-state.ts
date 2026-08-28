export interface PublicSiteSettings {
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

export type PublicSiteState =
  | { mode: "live" }
  | {
      heading: string;
      launchAt: string;
      message: string | null;
      mode: "countdown";
    }
  | {
      contactUrl: string | null;
      heading: string;
      message: string | null;
      mode: "maintenance";
      returnAt: string | null;
    };

/**
 * Converts the editor's public-site setting into a safe state for visitors.
 * Incomplete non-live settings leave the public site live rather than showing
 * a blank holding page.
 */
export function getPublicSiteState(
  settings: PublicSiteSettings | null | undefined,
  { bypass = false, now = new Date() }: { bypass?: boolean; now?: Date } = {}
): PublicSiteState {
  if (bypass) {
    return { mode: "live" };
  }

  if (
    settings?.publicSiteMode === "countdown" &&
    settings.countdown?.heading &&
    settings.countdown.launchAt
  ) {
    if (new Date(settings.countdown.launchAt).getTime() <= now.getTime()) {
      return { mode: "live" };
    }

    return {
      heading: settings.countdown.heading,
      launchAt: settings.countdown.launchAt,
      message: settings.countdown.message ?? null,
      mode: "countdown",
    };
  }

  if (
    settings?.publicSiteMode === "maintenance" &&
    settings.maintenance?.heading &&
    settings.maintenance.message
  ) {
    return {
      contactUrl: settings.maintenance.contactUrl ?? null,
      heading: settings.maintenance.heading,
      message: settings.maintenance.message,
      mode: "maintenance",
      returnAt: settings.maintenance.returnAt ?? null,
    };
  }

  return { mode: "live" };
}
