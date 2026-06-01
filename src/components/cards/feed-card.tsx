import Link from "next/link";
import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

const FEED_CARD_ASPECT_RATIO = 3 / 4;

type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

interface FeedCardProps {
  byline?: string;
  href: string;
  image: SanityImageSource;
  sponsored?: boolean;
  title: string;
  variant?: "bronze" | "silver" | "gold";
}

export default function FeedCard({
  byline,
  href,
  image,
  sponsored,
  title,
  variant,
}: FeedCardProps) {
  const linkRel = sponsored ? "noopener sponsored" : "noopener noreferrer";
  const hasImage =
    image &&
    typeof image === "object" &&
    "image" in image &&
    image.image?.asset;

  return (
    <Link
      className="group flex w-full flex-col items-start gap-2.5 rounded-[1.25rem]"
      href={href}
      target="_blank"
      rel={linkRel}
    >
      <AspectRatio
        className="relative overflow-hidden rounded-lg"
        ratio={FEED_CARD_ASPECT_RATIO}
      >
        {hasImage ? (
          <SanityImage
            alt={title}
            className="rounded-lg h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-103"
            fill
            sizes="(min-width: 480px) 480px, 100vw"
            source={image}
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-secondary" />
        )}
      </AspectRatio>
      {variant ? (
        <Badge variant={variant}>Sponsored</Badge>
      ) : null}
      <hgroup className="flex w-full flex-col items-start gap-2">
        <h3 className="text-pretty text-foreground text-lg leading-tight">
          {title}
        </h3>
        {byline ? (
          <p className="font-normal text-base text-muted-foreground">
            {byline}
          </p>
        ) : null}
      </hgroup>
    </Link>
  );
}
