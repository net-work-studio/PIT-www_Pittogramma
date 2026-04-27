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
  external?: boolean;
  href: string;
  /** Sanity image object (preferred) or plain URL string (design-system previews). */
  image: SanityImageSource | string;
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

export default function BaseCard({
  title,
  authors,
  badgeLabel,
  external,
  image,
  variant,
  href,
  big,
}: BaseCardProps) {
  const sizes = big
    ? "(min-width: 640px) 50vw, 100vw"
    : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

  const imageClassName =
    "h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-103";

  return (
    <Link
      className={cn(
        "span-col-1 group flex h-fit w-full flex-col items-start justify-center gap-2.5 rounded-[1.25rem]",
        big ? "col-span-2" : "col-span-1"
      )}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <AspectRatio
        className="relative overflow-hidden rounded-lg"
        ratio={BASE_CARD_IMAGE_RATIO}
      >
        {typeof image === "string" ? (
          image ? (
            <Image
              alt={title}
              className={imageClassName}
              fill
              quality={75}
              sizes={sizes}
              src={image}
            />
          ) : (
            <div className="h-full w-full rounded-lg bg-secondary" />
          )
        ) : image &&
          typeof image === "object" &&
          "image" in image &&
          image.image ? (
          <SanityImage
            alt={title}
            className={cn("rounded-lg", imageClassName)}
            fill
            sizes={sizes}
            source={image}
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-secondary" />
        )}
      </AspectRatio>
      {variant ? <Badge variant={variant}>{badgeLabel}</Badge> : null}
      <div className="inline-flex w-full flex-col items-start justify-start gap-0">
        <hgroup className="flex flex-col items-start justify-start gap-0   self-stretch">
          <h3 className="justify-start self-stretch font-normal font-sans text-base text-foreground">
            {title}
          </h3>
          {authors && authors.length > 0 ? (
            <p className="font-normal font-sans text-muted-foreground text-sm">
              {authors.map((author) => author.name).join(", ")}
            </p>
          ) : null}
        </hgroup>
      </div>
    </Link>
  );
}
