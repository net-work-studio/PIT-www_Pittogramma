import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const metadataKeys = ["date", "location", "disciplines"];
const shareLinkWidths = ["w-14", "w-16", "w-5", "w-20"];

export default function EventPageSkeleton() {
  return (
    <div aria-busy aria-label="Loading event" role="status">
      <span className="sr-only">Loading event</span>
      <div className="flex flex-col gap-6 px-2.5 pt-6 lg:flex-row lg:gap-10 lg:pt-16">
        <div className="flex w-full flex-col gap-6 lg:order-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full max-w-2xl" />
            <Skeleton className="h-10 w-8/12 max-w-xl" />
          </div>
          <div className="hidden flex-col gap-3 lg:flex">
            {metadataKeys.map((key) => (
              <div className="flex gap-x-12" key={key}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[49%] lg:shrink-0">
          <AspectRatio
            className="relative overflow-hidden rounded-xl"
            ratio={4 / 3}
          >
            <Skeleton className="h-full w-full" />
          </AspectRatio>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-2.5 pt-10 lg:max-w-4xl lg:pt-20">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-11/12" />
        <Skeleton className="h-8 w-8/12" />
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-2.5 px-2.5">
        <Skeleton className="h-4 w-11" />
        {shareLinkWidths.map((width) => (
          <Skeleton className={`h-4 ${width}`} key={width} />
        ))}
      </div>
    </div>
  );
}
