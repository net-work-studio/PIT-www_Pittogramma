import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { defineQuery } from "next-sanity";
import { Suspense } from "react";

import ContributorsSection from "@/components/modules/event/contributors-section";
import EventInfo from "@/components/modules/event/event-info";
import EventInfoGrid from "@/components/modules/event/event-info-grid";
import ShareLinks from "@/components/modules/project/share-links";
import CoverMedia from "@/components/modules/shared/cover-media";
import { JsonLd } from "@/components/seo/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { hasCoverMedia } from "@/lib/cover-media-utils";
import { formatDateRange } from "@/lib/date-utils";
import { buildExternalEventUrl } from "@/lib/event-destination";
import {
  formatEventLocationDisplay,
  getSchemaEventAttendanceMode,
  getSchemaEventLocation,
} from "@/lib/event-location";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { utmSettingsFromSiteSettings } from "@/lib/tracked-link";
import type { SeoImageSource, SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@/sanity/lib/live";
import { EVENT_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

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
  const [{ data: event }, { data: siteSettings }] = await Promise.all([
    sanityFetch({
      params: { slug },
      perspective,
      query: EVENT_QUERY,
      stega,
    }),
    sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
  ]);

  if (!event) {
    notFound();
  }

  if (event.cardDestination === "external" && event.externalUrl) {
    permanentRedirect(
      buildExternalEventUrl(
        event.externalUrl,
        slug,
        utmSettingsFromSiteSettings(siteSettings)
      )
    );
  }

  const imageUrl = event.cover?.image?.asset
    ? urlForImage(event.cover)?.url()
    : undefined;

  const eventUrl = `${siteDefaults.baseUrl}/events/${slug}`;

  const location = formatEventLocationDisplay(
    event.attendanceMode,
    event.locationName,
    event.locationAddress
  );

  const dateDisplay = formatDateRange(event.dateStart, event.dateEnd);

  return (
    <>
      <JsonLd
        data={{
          name: event.title,
          description: event.description,
          startDate: event.dateStart,
          endDate: event.dateEnd ?? event.dateStart,
          location: getSchemaEventLocation(
            event.attendanceMode,
            event.locationName,
            event.locationAddress,
            eventUrl
          ),
          image: imageUrl,
          url: eventUrl,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: getSchemaEventAttendanceMode(
            event.attendanceMode,
            event.locationName
          ),
        }}
        type="Event"
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="order-1 flex flex-col gap-6 px-2.5 pt-6 lg:flex-row lg:gap-10 lg:pt-16">
          <EventInfo
            attendanceMode={event.attendanceMode}
            dateEnd={event.dateEnd}
            dateStart={event.dateStart}
            locationAddress={event.locationAddress}
            locationName={event.locationName}
            tags={event.tags}
            title={event.title}
            type={event.type}
          />
          <div className="w-full lg:w-[49%] lg:shrink-0">
            <AspectRatio
              className="relative w-full overflow-hidden rounded-xl"
              ratio={4 / 3}
            >
              {hasCoverMedia(event.cover) ? (
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
