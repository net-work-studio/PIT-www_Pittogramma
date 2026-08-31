import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentCardSkeletonProps {
  showBadge?: boolean;
}

export function ContentCardSkeleton({
  showBadge = true,
}: ContentCardSkeletonProps) {
  return (
    <div className="flex h-fit w-full flex-col items-start gap-2.5">
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={4 / 3}
      >
        <Skeleton className="h-full w-full" />
      </AspectRatio>
      {showBadge ? <Skeleton className="mt-1 h-5 w-20 rounded-full" /> : null}
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-5 w-10/12" />
        <Skeleton className="h-4 w-7/12" />
      </div>
    </div>
  );
}
