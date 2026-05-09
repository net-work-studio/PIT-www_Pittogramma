import BaseCard from "@/components/cards/base-card";
import type SanityImage from "@/components/modules/shared/sanity-image";
import type { FEED_QUERY_RESULT } from "@/sanity/types";

type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

// Description is a Portable Text block array, projected straight through the
// FEED_QUERY. Phase 1 doesn't render it, but the prop is wired through so
// follow-up phases (hover, expand, line-clamp treatments) can layer on top.
type AdvDescription = NonNullable<FEED_QUERY_RESULT[number]["description"]>;

interface AdvCardProps {
  cover: SanityImageSource;
  // description: passed through for future render treatment, intentionally unrendered.
  description?: AdvDescription;
  externalUrl: string;
  sponsorName: string;
  title: string;
}

export default function AdvCard({
  cover,
  // description: passed through for future render treatment.
  description: _description,
  externalUrl,
  sponsorName,
  title,
}: AdvCardProps) {
  // description: passed through for future render treatment, intentionally unused.
  void _description;
  return (
    <BaseCard
      byline={`Sponsored by ${sponsorName}`}
      href={externalUrl}
      image={cover}
      sponsored
      title={title}
    />
  );
}
