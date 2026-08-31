import { ContentCardSkeleton } from "@/components/modules/shared/content-card-skeleton";
import { PageHeaderSkeleton } from "@/components/modules/shared/page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const cardKeys = ["one", "two", "three", "four"];

function EventSectionSkeleton({ title }: { title: string }) {
  return (
    <section aria-label={`Loading ${title} events`}>
      <Skeleton className="mb-6 h-5 w-24 rounded" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cardKeys.map((key) => (
          <ContentCardSkeleton key={key} />
        ))}
      </div>
    </section>
  );
}

export default function EventsPageSkeleton() {
  return (
    <div aria-busy aria-label="Loading events" role="status">
      <span className="sr-only">Loading events</span>
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-10 pb-10">
        <EventSectionSkeleton title="upcoming" />
        <EventSectionSkeleton title="past" />
      </div>
    </div>
  );
}
