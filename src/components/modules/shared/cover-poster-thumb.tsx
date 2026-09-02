import SanityImage from "@/components/modules/shared/sanity-image";
import { cn } from "@/lib/utils";
import type { CoverMediaData } from "./cover-media";

const THUMB_CLASS = "aspect-4/3 h-7 w-auto shrink-0 rounded-sm object-cover";

interface CoverPosterThumbProps {
  className?: string;
  cover?: CoverMediaData | null;
}

export default function CoverPosterThumb({
  cover,
  className,
}: CoverPosterThumbProps) {
  if (!cover?.image?.asset) {
    return (
      <div aria-hidden className={cn(THUMB_CLASS, "bg-primary/5", className)} />
    );
  }

  return (
    <SanityImage
      className={cn(THUMB_CLASS, className)}
      fit="crop"
      height={80}
      source={cover}
      width={112}
    />
  );
}
