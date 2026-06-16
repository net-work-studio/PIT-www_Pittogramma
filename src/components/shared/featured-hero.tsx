import Link from "next/link";
import CoverMedia, {
  type CoverMediaData,
} from "@/components/modules/shared/cover-media";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeaturedHeroProps {
  badgeLabel?: string;
  badgeVariant?: "project" | "interview" | "article" | "diary" | "baseline";
  contentType: "project" | "interview" | "journal";
  cover: CoverMediaData | null | undefined;
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
  full: "h-[calc(100svh-3.5rem-2.5rem)]",
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
        "group relative my-5 grid place-content-center",
        HEIGHT_BY_VARIANT[variant]
      )}
      href={href}
    >
      <div className="z-10 flex w-full flex-col items-center gap-4 px-4 text-center text-white sm:px-6">
        {badgeLabel && (
          <Badge
            className="outline-white"
            variant={badgeVariant ?? badgeVariantMap[contentType]}
          >
            {badgeLabel}
          </Badge>
        )}
        <hgroup className="flex w-full flex-col items-center gap-2">
          <h2 className="text-balance font-normal font-sans text-4xl md:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="text-2xl text-white">{subtitle}</p>}
        </hgroup>
      </div>

      <div className="absolute z-1 h-full w-full rounded-xl bg-black/20 transition-opacity duration-500 group-hover:bg-black/15" />

      <CoverMedia
        className="absolute h-full w-full rounded-xl object-cover transition-transform duration-300"
        cover={cover}
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 75vw"
      />
    </Link>
  );
}
