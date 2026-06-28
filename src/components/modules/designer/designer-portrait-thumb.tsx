import SanityImage from "@/components/modules/shared/sanity-image";
import { cn } from "@/lib/utils";
import { getImageSource } from "@/sanity/lib/image";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type Portrait = DESIGNERS_QUERY_RESULT[number]["portrait"];

export function designerInitial(name?: string | null): string {
  return name?.trim().slice(0, 1) || "?";
}

interface DesignerPortraitThumbProps {
  className?: string;
  name?: string | null;
  portrait: Portrait;
}

export default function DesignerPortraitThumb({
  portrait,
  name,
  className,
}: DesignerPortraitThumbProps) {
  if (getImageSource(portrait)) {
    return (
      <SanityImage
        className={cn("size-7 shrink-0 rounded-full object-cover", className)}
        fit="crop"
        height={112}
        source={portrait}
        width={112}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full bg-primary/5",
        className
      )}
    >
      <span className="text-muted-foreground text-xs">
        {designerInitial(name)}
      </span>
    </div>
  );
}
