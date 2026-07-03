import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type SocialLinkPlatform = NonNullable<
  NonNullable<DESIGNERS_QUERY_RESULT[number]["socialLinks"]>["links"]
>[number]["platform"];

export const SOCIAL_LINK_LABELS: Record<SocialLinkPlatform, string> = {
  behance: "Behance",
  bluesky: "Bluesky",
  ig: "Instagram",
  linkedin: "LinkedIn",
  linktree: "Linktree",
  mastodon: "Mastodon",
  spotify: "Spotify",
  substack: "Substack",
  tiktok: "TikTok",
  website: "Website",
  x: "X",
};
