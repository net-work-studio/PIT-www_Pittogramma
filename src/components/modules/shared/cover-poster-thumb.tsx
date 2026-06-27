import SanityImage from "@/components/modules/shared/sanity-image";
import { hasCoverPoster } from "@/lib/cover-media-utils";
import { cn } from "@/lib/utils";
import type { CoverMediaData } from "./cover-media";

const THUMB_CLASS = "aspect-4/3 h-7 w-auto shrink-0 rounded-sm";

interface CoverPosterThumbProps {
  className?: string;
  cover?: CoverMediaData | null;
}

export default function CoverPosterThumb({
  cover,
  className,
}: CoverPosterThumbProps) {
  if (!hasCoverPoster(cover)) {
    return (
      <div className={cn(THUMB_CLASS, "bg-primary/5", className)} aria-hidden />
    );
  }

  return (
    <SanityImage
      className={cn(
        THUMB_CLASS,
        "object-cover transition-opacity duration-100 ease-out group-hover/project:opacity-80",
        className
      )}
      fit="crop"
      height={80}
      source={cover}
      width={112}
    />
  );
}
