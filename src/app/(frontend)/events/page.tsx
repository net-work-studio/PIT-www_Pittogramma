import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import LoadMore from "@/components/feat/load-more/load-more";
import EventsPageSkeleton from "@/components/modules/shared/events-page-skeleton";
import type SanityImage from "@/components/modules/shared/sanity-image";
import PageHeader from "@/components/shared/page-header";
import { buildLocalToday } from "@/lib/date-utils";
import { formatEventCardLocation } from "@/lib/event-location";
import { EVENT_TYPE_BADGE_VARIANT, getEventTypeLabel } from "@/lib/event-type";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import {
  EVENTS_PAGE_QUERY,
  FUTURE_EVENTS_QUERY,
  PAST_EVENTS_COUNT_QUERY,
  PAST_EVENTS_QUERY,
} from "@/sanity/lib/queries";
import type {
  FUTURE_EVENTS_QUERY_RESULT,
  PAST_EVENTS_QUERY_RESULT,
} from "@/sanity/types";

const PAGE_SIZE = 48;
const MAX_PAGE = 20;

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    query: EVENTS_PAGE_QUERY,
    perspective,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Events",
      description: page?.introText ?? undefined,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/events",
    siteDefaults,
  });
}

type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

interface EventCard {
  authors: { name: string }[] | undefined;
  badgeLabel: string | undefined;
  href: string;
  id: string;
  image: SanityImageSource;
  isExternal: boolean;
  title: string;
}

type EventDoc =
  | FUTURE_EVENTS_QUERY_RESULT[number]
  | PAST_EVENTS_QUERY_RESULT[number];

function mapEventToCard(event: EventDoc): EventCard {
  const subtitle =
    event.cardDestination === "external"
      ? formatEventCardLocation("offline", event.locationName)
      : formatEventCardLocation(event.attendanceMode, event.locationName);
  const typeLabel = getEventTypeLabel(event.type);

  return {
    authors: subtitle ? [{ name: subtitle }] : undefined,
    badgeLabel: typeLabel ?? undefined,
    href: `/events/${event.slug?.current}`,
    id: event._id,
    image: event.cover,
    isExternal: event.cardDestination === "external",
    title: event.title ?? "",
  };
}

// Layer 1: Page is SYNC, always uses Suspense
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <DynamicEventsPage searchParams={searchParams} />
    </Suspense>
  );
}

// Layer 2: Dynamic — awaits searchParams + getDynamicFetchOptions
async function DynamicEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [sp, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedEventsPage
      pageParam={sp.page}
      perspective={perspective}
      stega={stega}
      today={buildLocalToday()}
    />
  );
}

// Layer 3: Cached — has 'use cache', ALL fetching + rendering logic
async function CachedEventsPage({
  pageParam,
  perspective,
  stega,
  today,
}: {
  pageParam?: string;
  today: string;
} & DynamicFetchOptions) {
  "use cache";

  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  if (requestedPage > MAX_PAGE) {
    notFound();
  }
  const page = requestedPage;
  const start = 0;
  const end = page * PAGE_SIZE;
  const includeFuture = perspective !== "published";

  const [
    { data: futureEventsData },
    { data: pastEventsData },
    { data: pastTotalCount },
    { data: pageSettings },
  ] = await Promise.all([
    sanityFetch({
      query: FUTURE_EVENTS_QUERY,
      params: { includeFuture, today },
      perspective,
      stega,
    }),
    sanityFetch({
      query: PAST_EVENTS_QUERY,
      params: { end, includeFuture, start, today },
      perspective,
      stega,
    }),
    sanityFetch({
      query: PAST_EVENTS_COUNT_QUERY,
      params: { includeFuture, today },
      perspective,
      stega,
    }),
    sanityFetch({ query: EVENTS_PAGE_QUERY, perspective, stega }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const totalPagesPast = Math.max(
    1,
    Math.ceil((pastTotalCount ?? 0) / PAGE_SIZE)
  );
  if (page > totalPagesPast) {
    notFound();
  }

  const futureEvents = (
    (futureEventsData ?? []) as FUTURE_EVENTS_QUERY_RESULT
  ).map(mapEventToCard);

  const pastEvents = ((pastEventsData ?? []) as PAST_EVENTS_QUERY_RESULT).map(
    mapEventToCard
  );

  return (
    <>
      <PageHeader
        subtitle={
          pageSettings?.introText ??
          "Through events, talks and workshops, Pittogramma creates moments of dialogue around graphic design, visual culture and the territories they intersect"
        }
        title={pageSettings?.title ?? "Events"}
      />
      <div className="space-y-10 pb-10">
        {futureEvents.length > 0 && (
          <section>
            <h2 className="mb-6 border-b pb-2 font-mono text-sm uppercase">
              Upcoming
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {futureEvents.map((event) => (
                <BaseCard
                  authors={event.authors}
                  badgeLabel={event.badgeLabel}
                  external={event.isExternal}
                  href={event.href}
                  image={event.image}
                  key={event.id}
                  title={event.title}
                  variant={
                    event.badgeLabel ? EVENT_TYPE_BADGE_VARIANT : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-6 border-b pb-2 font-mono text-sm uppercase">
            Past
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastEvents.map((event) => (
              <BaseCard
                authors={event.authors}
                badgeLabel={event.badgeLabel}
                external={event.isExternal}
                href={event.href}
                image={event.image}
                key={event.id}
                title={event.title}
                variant={
                  event.badgeLabel ? EVENT_TYPE_BADGE_VARIANT : undefined
                }
              />
            ))}
          </div>
        </section>
        <LoadMore currentPage={page} totalPages={totalPagesPast} />
      </div>
      {cta && (
        <CtaCard
          buttonText={cta.buttonText}
          externalUrl={cta.externalUrl}
          headline={cta.headline}
          imgDark={cta.imgDark}
          imgLight={cta.imgLight}
          internalLink={cta.internalLink}
          linkType={cta.linkType}
          variant={cta.variant}
        />
      )}
    </>
  );
}
