import Link from "next/link";
import SanityImage from "@/components/modules/shared/sanity-image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeaturedHeroProps {
  badgeLabel?: string;
  badgeVariant?: "project" | "interview" | "article" | "diary" | "baseline";
  contentType: "project" | "interview" | "journal";
  cover: Parameters<typeof SanityImage>[0]["source"];
  href: string;
  subtitle?: string | null;
  title: string;
  variant?: "full" | "compact";
}

const badgeVariantMap: Record<
  FeaturedHeroProps["contentType"],
  "project" | "interview" | "article"
> = {
  journal: "article",
  project: "project",
  interview: "interview",
};

const HEIGHT_BY_VARIANT = {
  full: "h-[calc(100svh-3.5rem)] max-h-400",
  compact: "h-[600px]",
} as const;

export default function FeaturedHero({
  badgeLabel,
  badgeVariant,
  contentType,
  title,
  href,
  cover,
  subtitle,
  variant = "full",
}: FeaturedHeroProps) {
  return (
    <Link
      className={cn(
        "group relative grid place-content-center",
        HEIGHT_BY_VARIANT[variant]
      )}
      href={href}
    >


        <div className="flex z-10 flex-col text-background items-center gap-4">
          <div className="flex gap-2">
            <Badge variant="outline">Feature Now</Badge>
            <Badge variant={badgeVariant ?? badgeVariantMap[contentType]}>
              {badgeLabel}
            </Badge>
          </div>
          <h2 className="font-normal font-sans text-balance text-2xl md:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>


        <div className="bg-black/30 group-hover:bg-black/25 transition-opacity duration-500 rounded-md z-1 w-full h-full absolute" />

        <SanityImage
          alt={title}
          className="h-full absolute rounded-md w-full transition-transform duration-300 object-cover"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 75vw"
          source={cover}
        />

    </Link>
  );
}
