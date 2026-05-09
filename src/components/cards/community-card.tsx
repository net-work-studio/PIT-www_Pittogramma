import BaseCard from "@/components/cards/base-card";
import type SanityImage from "@/components/modules/shared/sanity-image";
import type { FEED_COMMUNITY_QUERY_RESULT } from "@/sanity/types";

type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

// Description is a Portable Text block array, projected straight through the
// FEED_COMMUNITY_QUERY. Phase 3 doesn't render it, but the prop is wired
// through so follow-up phases (hover, expand, line-clamp treatments) can
// layer on top — same pattern as AdvCard.
type CommunityDescription = NonNullable<
  FEED_COMMUNITY_QUERY_RESULT[number]["description"]
>;

interface CommunityCardProps {
  cover: SanityImageSource;
  /**
   * Portable Text description, threaded through from the feed query.
   * Intentionally unrendered — reserved for future render treatment
   * (hover, expand, line-clamp). Do not remove.
   */
  description?: CommunityDescription;
  externalUrl: string;
  /** When set, byline becomes "In partnership with [partnerName]"; otherwise "Community". */
  partnerName?: string | null;
  title: string;
}

export default function CommunityCard({
  cover,
  externalUrl,
  partnerName,
  title,
}: CommunityCardProps) {
  const byline = partnerName
    ? `In partnership with ${partnerName}`
    : "Community";

  return (
    <BaseCard
      byline={byline}
      href={externalUrl}
      image={cover}
      sponsored
      title={title}
    />
  );
}
