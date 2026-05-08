import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import LoadMore from "@/components/feat/load-more/load-more";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getEventStatusConfig } from "@/lib/event-status";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import type SanityImage from "@/components/modules/shared/sanity-image";
import { sanityFetch } from "@/sanity/lib/live";
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
const MAX_PAGE = 100;

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: EVENTS_PAGE_QUERY,
    stega: false,
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
  badgeVariant: Parameters<typeof BaseCard>[0]["variant"];
  href: string;
  id: string;
  image: SanityImageSource;
  title: string;
}

type EventDoc =
  | FUTURE_EVENTS_QUERY_RESULT[number]
  | PAST_EVENTS_QUERY_RESULT[number];

function mapEventToCard(event: EventDoc): EventCard {
  const subtitle = event.locationName ?? event.type;
  const statusConfig = getEventStatusConfig(event.status);

  return {
    authors: subtitle ? [{ name: subtitle }] : undefined,
    badgeLabel: statusConfig?.label,
    badgeVariant: statusConfig?.badgeVariant ?? "event",
    href: `/events/${event.slug?.current}`,
    id: event._id,
    image: event.cover,
    title: event.title ?? "",
  };
}

function getLocalTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  if (requestedPage > MAX_PAGE) notFound();
  const page = requestedPage;
  const start = 0;
  const end = page * PAGE_SIZE;
  const today = getLocalTodayString();

  const [
    { data: futureEventsData },
    { data: pastEventsData },
    { data: pastTotalCount },
    { data: pageSettings },
  ] = await Promise.all([
    sanityFetch({
      query: FUTURE_EVENTS_QUERY,
      params: { today },
    }),
    sanityFetch({
      query: PAST_EVENTS_QUERY,
      params: { today, start, end },
    }),
    sanityFetch({
      query: PAST_EVENTS_COUNT_QUERY,
      params: { today },
    }),
    sanityFetch({ query: EVENTS_PAGE_QUERY }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const totalPagesPast = Math.max(
    1,
    Math.ceil((pastTotalCount ?? 0) / PAGE_SIZE)
  );
  if (page > totalPagesPast) notFound();

  const futureEvents = (
    (futureEventsData ?? []) as FUTURE_EVENTS_QUERY_RESULT
  ).map(mapEventToCard);

  const pastEvents = (
    (pastEventsData ?? []) as PAST_EVENTS_QUERY_RESULT
  ).map(mapEventToCard);

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
        <div>
          <Button className="font-mono uppercase">Filters</Button>
        </div>

        {futureEvents.length > 0 && (
          <section>
            <h2 className="mb-6 border-b pb-2 font-mono text-sm uppercase">
              Next
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {futureEvents.map((event) => (
                <BaseCard
                  authors={event.authors}
                  badgeLabel={event.badgeLabel}
                  href={event.href}
                  image={event.image}
                  key={event.id}
                  title={event.title}
                  variant={event.badgeVariant}
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
                href={event.href}
                image={event.image}
                key={event.id}
                title={event.title}
                variant={event.badgeVariant}
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
          image={cta.image}
          internalLink={cta.internalLink}
          linkType={cta.linkType}
          variant={cta.variant}
        />
      )}
    </>
  );
}
