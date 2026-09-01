import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 pt-16 pb-24 text-center">
      <Skeleton className="h-7 w-32" />
      <div className="flex w-full max-w-prose flex-col items-center gap-2">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-9/12" />
      </div>
    </div>
  );
}
