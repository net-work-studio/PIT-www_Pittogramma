import type { ReactNode } from "react";

import CoverMedia, {
  type CoverMediaData,
} from "@/components/modules/shared/cover-media";

interface EditorialPageHeroProps {
  badge: ReactNode;
  byline?: string | null;
  cover?: CoverMediaData | null;
  date?: string | null;
  title: string;
}

export default function EditorialPageHero({
  badge,
  byline,
  cover,
  date,
  title,
}: EditorialPageHeroProps) {
  return (
    <header className="px-2.5 pt-7.5">
      <figure>
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <CoverMedia
            className="rounded-xl object-cover"
            cover={cover}
            fill
            fillWidth={3840}
            priority
          />
        </div>
        {cover?.alt ? (
          <figcaption className="mt-1.5 font-mono text-muted-foreground text-xs uppercase">
            {cover.alt}
          </figcaption>
        ) : null}
      </figure>

      <div className="mx-auto flex w-full flex-col items-center gap-2 pt-7.5 text-center lg:max-w-[65%]">
        {badge}
        <h1 className="text-pretty text-3xl leading-none">{title}</h1>
        {byline ? (
          <p className="text-pretty text-2xl text-muted-foreground">{byline}</p>
        ) : null}
        {date ? (
          <p className="pt-1 font-mono text-muted-foreground text-sm uppercase">
            {date}
          </p>
        ) : null}
      </div>
    </header>
  );
}
