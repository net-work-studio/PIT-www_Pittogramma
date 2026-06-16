import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import { Suspense } from "react";

import ContributorsSection from "@/components/modules/event/contributors-section";
import EventInfo from "@/components/modules/event/event-info";
import EventInfoGrid from "@/components/modules/event/event-info-grid";
import ShareLinks from "@/components/modules/project/share-links";
import CoverMedia from "@/components/modules/shared/cover-media";
import { JsonLd } from "@/components/seo/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildLocalToday, formatDateRange } from "@/lib/date-utils";
import { getEventStatusConfig } from "@/lib/event-status";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoImageSource, SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@/sanity/lib/live";
import { EVENT_QUERY } from "@/sanity/lib/queries";

function getSchemaEventStatus(status: string | null | undefined): string {
  if (status === "cancelled") {
    return "https://schema.org/EventCancelled";
  }
  if (status === "postponed") {
    return "https://schema.org/EventPostponed";
  }
  return "https://schema.org/EventScheduled";
}

export async function generateStaticParams() {
  const eventSlugsQuery = defineQuery(
    `*[_type == "event" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
  );
  const { data } = await sanityFetchStaticParams({ query: eventSlugsQuery });
  return data as { slug: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data: event } = await sanityFetchMetadata({
    query: EVENT_QUERY,
    params: { slug },
    perspective,
  });

  if (!event) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: event.title ?? "Event",
      description: event.description ?? undefined,
      coverImage: (event.cover as SeoImageSource) ?? undefined,
      seo: event.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: `/events/${slug}`,
    siteDefaults,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicEventPage params={params} />
      </Suspense>
    );
  }
  const { slug } = await params;
  return <CachedEventPage perspective="published" slug={slug} stega={false} />;
}

async function DynamicEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedEventPage perspective={perspective} slug={slug} stega={stega} />
  );
}

async function CachedEventPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const today = buildLocalToday();
  const { data: event } = await sanityFetch({
    query: EVENT_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!event) {
    notFound();
  }

  const imageUrl = event.cover?.image?.asset
    ? urlForImage(event.cover)?.url()
    : undefined;

  const isPast = !event.dateStart || event.dateStart < today;
  const statusConfig = getEventStatusConfig(event.status);
  const ctaUrl = !isPast && statusConfig?.ctaLabel ? event.ctaUrl : null;

  const eventUrl = `${siteDefaults.baseUrl}/events/${slug}`;

  const location = [event.locationName, event.locationAddress]
    .filter(Boolean)
    .join(" — ");

  const dateDisplay = formatDateRange(event.dateStart, event.dateEnd);

  return (
    <>
      <JsonLd
        data={{
          name: event.title,
          description: event.description,
          startDate: event.dateStart,
          endDate: event.dateEnd ?? event.dateStart,
          location: event.locationName
            ? {
                "@type": "Place",
                name: event.locationName,
                address: event.locationAddress ?? undefined,
              }
            : undefined,
          image: imageUrl,
          url: eventUrl,
          eventStatus: getSchemaEventStatus(event.status),
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        }}
        type="Event"
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="order-1 flex flex-col gap-6 px-2.5 pt-6 lg:flex-row lg:gap-10 lg:pt-16">
          <EventInfo
            ctaUrl={event.ctaUrl}
            dateEnd={event.dateEnd}
            dateStart={event.dateStart}
            isPast={isPast}
            locationAddress={event.locationAddress}
            locationName={event.locationName}
            status={event.status}
            tags={event.tags}
            title={event.title}
            type={event.type}
          />
          <div className="w-full lg:w-[49%] lg:shrink-0">
            <AspectRatio
              className="relative w-full overflow-hidden rounded-xl"
              ratio={4 / 3}
            >
              {event.cover?.image?.asset ||
              (event.cover?.type === "video" && event.cover?.videoUrl) ? (
                <CoverMedia
                  className="rounded-xl object-cover"
                  cover={event.cover}
                  fill
                  priority
                />
              ) : (
                <div className="h-full w-full rounded-xl bg-neutral-200" />
              )}
            </AspectRatio>
            {event.cover?.alt ? (
              <p className="mt-1.5 font-mono text-[0.5rem] text-muted-foreground uppercase">
                {event.cover.alt}
              </p>
            ) : null}
          </div>
        </div>

        {/* Description Section */}
        {event.description ? (
          <div className="order-3 border-foreground border-t-[0.5px] px-2.5 pt-6 lg:order-2 lg:border-t-0 lg:pt-20">
            <p className="font-mono text-muted-foreground text-xs uppercase lg:text-2xl">
              About
            </p>
            <p className="text-base leading-normal lg:text-[2rem] lg:leading-tight">
              {event.description}
            </p>
          </div>
        ) : null}

        {/* Info Grid */}
        {event.info?.length ? (
          <div className="order-4 lg:order-3 lg:pt-10">
            <EventInfoGrid info={event.info} />
          </div>
        ) : null}

        {/* Sponsors & Partners */}
        <div className="order-5 px-2.5 pt-6 lg:order-4">
          <ContributorsSection
            partners={event.partners}
            sponsors={event.sponsors}
          />
        </div>

        {/* Mobile-only metadata */}
        <div className="order-6 mt-6 flex flex-col gap-4 px-2.5 lg:hidden">
          {statusConfig ? (
            <Badge variant={statusConfig.badgeVariant}>
              {statusConfig.label}
            </Badge>
          ) : null}

          {ctaUrl ? (
            <a href={ctaUrl} rel="noopener noreferrer" target="_blank">
              <Button className="font-mono uppercase">
                {statusConfig?.ctaLabel}
              </Button>
            </a>
          ) : null}

          <dl className="flex flex-col gap-1">
            {dateDisplay ? (
              <div className="flex gap-x-12">
                <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                  Date
                </dt>
                <dd className="text-sm">{dateDisplay}</dd>
              </div>
            ) : null}
            {location ? (
              <div className="flex gap-x-12">
                <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                  Location
                </dt>
                <dd className="text-sm">{location}</dd>
              </div>
            ) : null}
            {event.tags?.filter(Boolean).some((t) => t.name) ? (
              <div className="flex gap-x-12">
                <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                  Disciplines
                </dt>
                <dd>
                  <ul className="flex flex-col">
                    {event.tags
                      .filter(Boolean)
                      .filter((tag) => tag.name)
                      .map((tag) => (
                        <li className="text-sm underline" key={tag._id}>
                          {tag.name}
                        </li>
                      ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {/* Share Links */}
        <div className="order-7 px-2.5 pt-10">
          <ShareLinks title={event.title ?? ""} url={eventUrl} />
        </div>
      </div>
    </>
  );
}
