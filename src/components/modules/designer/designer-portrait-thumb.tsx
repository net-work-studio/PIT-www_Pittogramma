import SanityImage from "@/components/modules/shared/sanity-image";
import { cn } from "@/lib/utils";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type Portrait = DESIGNERS_QUERY_RESULT[number]["portrait"];

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
  if (portrait?.image?.asset) {
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
      <span className="text-muted-foreground text-xs">{name?.slice(0, 1)}</span>
    </div>
  );
}
