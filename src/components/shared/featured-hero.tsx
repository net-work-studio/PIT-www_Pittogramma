import Link from "next/link";
import SanityImage from "@/components/modules/shared/sanity-image";
import { Badge } from "@/components/ui/badge";

interface FeaturedHeroProps {
  badgeLabel?: string;
  badgeVariant?: "project" | "interview" | "article" | "diary" | "baseline";
  contentType: "project" | "interview" | "journal";
  cover: Parameters<typeof SanityImage>[0]["source"];
  href: string;
  subtitle?: string | null;
  title: string;
}

const badgeVariantMap: Record<
  FeaturedHeroProps["contentType"],
  "project" | "interview" | "article"
> = {
  journal: "article",
  project: "project",
  interview: "interview",
};

export default function FeaturedHero({
  badgeLabel,
  badgeVariant,
  contentType,
  title,
  href,
  cover,
  subtitle,
}: FeaturedHeroProps) {
  return (
    <Link className="group flex" href={href}>
      {/* Text column — 1 of 4 */}
      <div className="flex flex-col justify-start gap-6 xl:col-span-1">
        <div className="flex flex-col gap-4">
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
      </div>

      {/* Image column — 3 of 4 */}
      <div className="relative aspect-4/3 max-h-150 w-full  overflow-hidden rounded-lg transition-transform duration-300">
        <SanityImage
          alt={title}
          className="h-full w-full group-hover:scale-103 transition-transform duration-300 object-cover"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 75vw"
          source={cover}
        />
      </div>
    </Link>
  );
}
