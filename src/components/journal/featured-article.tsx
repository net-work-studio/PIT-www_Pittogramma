import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface FeaturedArticleProps {
  title: string;
  excerpt?: string | null;
  image: string;
  blurDataURL?: string;
  href: string;
  date?: string | null;
  tags?: { name: string }[];
  authors?: { name: string }[];
}

export default function FeaturedArticle({
  title,
  excerpt,
  image,
  blurDataURL,
  href,
  date,
  tags,
  authors,
}: FeaturedArticleProps) {
  return (
    <Link
      className="group flex flex-col gap-6 overflow-hidden rounded-2xl bg-secondary p-4 md:flex-row md:p-6"
      href={href}
    >
      {/* Left column — text content */}
      <div className="flex flex-col justify-between gap-6 md:w-1/3">
        <div className="flex flex-col gap-4">
          <Badge variant="feat">Featured now</Badge>
          <h2 className="font-normal font-sans text-2xl md:text-3xl">
            {title}
          </h2>
          {excerpt && (
            <p className="line-clamp-4 text-muted-foreground text-sm">
              {excerpt}
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
          {authors && authors.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">
                {authors.length > 1 ? "Authors" : "Author"}
              </dt>
              <dd>{authors.map((a) => a.name).join(", ")}</dd>
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
        <Image
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          priority
          quality={75}
          sizes="(max-width: 768px) 100vw, 66vw"
          src={image}
          {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
        />
      </div>
    </Link>
  );
}
