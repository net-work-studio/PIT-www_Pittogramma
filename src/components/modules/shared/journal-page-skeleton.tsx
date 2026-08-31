import { ContentCardSkeleton } from "@/components/modules/shared/content-card-skeleton";
import { PageHeaderSkeleton } from "@/components/modules/shared/page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const cardKeys = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];

function FeaturedHeroSkeleton() {
  return (
    <div className="relative my-5 grid h-[600px] place-content-center overflow-hidden rounded-xl">
      <Skeleton className="absolute inset-0 h-full w-full" />
      <div className="z-10 flex w-full flex-col items-center gap-4 px-4 sm:px-6">
        <Skeleton className="h-5 w-20 rounded-full" />
        <div className="flex w-full flex-col items-center gap-2">
          <Skeleton className="h-12 w-10/12 max-w-3xl" />
          <Skeleton className="h-8 w-5/12 max-w-xl" />
        </div>
      </div>
    </div>
  );
}

export default function JournalPageSkeleton() {
  return (
    <div aria-busy aria-label="Loading journal" role="status">
      <span className="sr-only">Loading journal</span>
      <FeaturedHeroSkeleton />
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-10 pb-10">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cardKeys.map((key) => (
            <ContentCardSkeleton key={key} />
          ))}
        </div>
      </div>
    </div>
  );
}
