import Link from "next/link";
import SanityImage from "@/components/modules/shared/sanity-image";
import { Badge } from "@/components/ui/badge";

interface FeaturedHeroProps {
  contentType: "project" | "interview";
  cover: Parameters<typeof SanityImage>[0]["source"];
  date?: string | null;
  description?: string | null;
  href: string;
  people?: { name: string }[];
  tags?: { name: string }[];
  title: string;
}

export default function FeaturedHero({
  contentType,
  title,
  href,
  cover,
  description,
  date,
  people,
  tags,
}: FeaturedHeroProps) {
  return (
    <Link
      className="group flex flex-col gap-6 overflow-hidden rounded-2xl md:flex-row"
      href={href}
    >
      {/* Left column — text content */}
      <div className="flex flex-col justify-start gap-6 md:w-1/3">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Badge variant="outline">Feature Now</Badge>
            <Badge variant={contentType} />
          </div>
          <h2 className="font-normal font-sans text-2xl md:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="line-clamp-4 text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </div>

        {/* Metadata table */}
        <dl className="flex flex-col gap-2 font-mono text-xs uppercase">
          {date && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Date</dt>
              <dd>{date}</dd>
            </div>
          )}
          {people && people.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">
                {contentType === "project" ? "Designers" : "People"}
              </dt>
              <dd>{people.map((p) => p.name).join(", ")}</dd>
            </div>
          )}
          {tags && tags.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Tags</dt>
              <dd>{tags.map((t) => t.name).join(", ")}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Right column — cover image */}
      <div className="relative aspect-4/3 overflow-hidden rounded-lg md:w-2/3">
        <SanityImage
          alt={title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          source={cover}
        />
      </div>
    </Link>
  );
}
