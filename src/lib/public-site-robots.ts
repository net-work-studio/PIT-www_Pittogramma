import type { PublicSiteState } from "./public-site-state";

export const HOLDING_PAGE_ROBOTS_HEADER = "noindex, nofollow";

export function getPublicSiteRobotsHeader(
  state: PublicSiteState
): string | null {
  return state.mode === "live" ? null : HOLDING_PAGE_ROBOTS_HEADER;
}
