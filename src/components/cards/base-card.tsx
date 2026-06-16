import Image from "next/image";
import Link from "next/link";
import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BASE_CARD_IMAGE_RATIO = 4 / 3;

type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

interface Author {
  name: string;
}

interface BaseCardProps {
  authors?: Author[];
  badgeLabel?: string;
  big?: boolean;
  /** Custom byline. When provided, replaces the joined authors list under the title. */
  byline?: string;
  external?: boolean;
  href: string;
  /** Sanity image object (preferred) or plain URL string (design-system previews). */
  image: SanityImageSource | string;
  /**
   * Marks the outbound link as a paid placement. Implies `external` and switches
   * `rel` from "noopener noreferrer" to "noopener sponsored" per SEO guidance for
   * commercial links. https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
   */
  sponsored?: boolean;
  title: string;
  variant?:
    | "project"
    | "article"
    | "diary"
    | "baseline"
    | "journal"
    | "interview"
    | "feat"
    | "event"
    | "event-coming-soon"
    | "event-available"
    | "event-sold-out"
    | "event-waitlist"
    | "event-postponed"
    | "event-cancelled"
    | "bronze"
    | "silver"
    | "gold";
}

function renderCardImage({
  image,
  imageClassName,
  sizes,
  title,
}: {
  image: SanityImageSource | string;
  imageClassName: string;
  sizes: string;
  title: string;
}) {
  if (typeof image === "string") {
    if (!image) {
      return <div className="h-full w-full rounded-xl bg-secondary" />;
    }

    return (
      <Image
        alt={title}
        className={imageClassName}
        fill
        quality={75}
        sizes={sizes}
        src={image}
      />
    );
  }

  if (image && typeof image === "object" && "image" in image && image.image) {
    return (
      <SanityImage
        alt={title}
        className={cn("rounded-xl", imageClassName)}
        fill
        sizes={sizes}
        source={image}
      />
    );
  }

  return <div className="h-full w-full rounded-xl bg-secondary" />;
}

function getByline({
  authors,
  byline,
}: {
  authors?: Author[];
  byline?: string;
}): string | null {
  if (byline) {
    return byline;
  }
  if (authors?.length) {
    return authors.map((author) => author.name).join(", ");
  }
  return null;
}

export default function BaseCard({
  title,
  authors,
  badgeLabel,
  byline,
  external,
  image,
  variant,
  href,
  big,
  sponsored,
}: BaseCardProps) {
  const isExternal = external || sponsored;
  const linkRel = sponsored ? "noopener sponsored" : "noopener noreferrer";
  const sizes = big
    ? "(min-width: 640px) 50vw, 100vw"
    : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

  const imageClassName =
    "h-full w-full rounded-xl ease-out object-cover transition-transform duration-200 group-hover:scale-103";
  const cardByline = getByline({ authors, byline });

  return (
    <Link
      className={cn(
        "span-col-1 group flex h-fit w-full flex-col items-start justify-center gap-2.5 rounded-card",
        big ? "col-span-2" : "col-span-1"
      )}
      href={href}
      {...(isExternal ? { target: "_blank", rel: linkRel } : {})}
    >
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={BASE_CARD_IMAGE_RATIO}
      >
        {renderCardImage({ image, imageClassName, sizes, title })}
      </AspectRatio>
      {variant ? (
        <Badge className="mt-1" variant={variant}>
          {badgeLabel}
        </Badge>
      ) : null}
      <div className="inline-flex w-full flex-col items-start justify-start">
        <hgroup className="flex flex-col items-start justify-start gap-1">
          <h3 className="text-pretty text-foreground text-lg leading-tight">
            {title}
          </h3>
          {cardByline ? (
            <p className="font-normal text-base text-muted-foreground">
              {cardByline}
            </p>
          ) : null}
        </hgroup>
      </div>
    </Link>
  );
}
