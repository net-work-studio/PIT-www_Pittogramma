import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EventInfo from "@/components/modules/event/event-info";
import ShareLinks from "@/components/modules/project/share-links";
import SanityImage from "@/components/modules/shared/sanity-image";
import { JsonLd } from "@/components/seo/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventStatusConfig } from "@/lib/event-status";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoImageSource, SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { EVENT_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: event } = await sanityFetch({
    query: EVENT_QUERY,
    params: { slug },
    stega: false,
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
  const { slug } = await params;
  const { data: event } = await sanityFetch({
    query: EVENT_QUERY,
    params: { slug },
  });

  if (!event) {
    notFound();
  }

  const imageUrl = event.cover?.image?.asset
    ? urlForImage(event.cover.image as Parameters<typeof urlForImage>[0])?.url()
    : undefined;

  const now = new Date().toISOString().split("T")[0];
  const isPast = !event.dateStart || event.dateStart < now;
  const statusConfig = getEventStatusConfig(event.status);
  const showCta = !isPast && statusConfig?.ctaLabel && event.ctaUrl;

  const eventUrl = `${siteDefaults.baseUrl}/events/${slug}`;

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const location = [event.locationName, event.locationAddress]
    .filter(Boolean)
    .join(" — ");

  const dateDisplay = event.dateStart
    ? event.dateEnd && event.dateEnd !== event.dateStart
      ? `${formatDate(event.dateStart)} — ${formatDate(event.dateEnd)}`
      : formatDate(event.dateStart)
    : null;

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
          eventStatus: isPast
            ? "https://schema.org/EventScheduled"
            : event.status === "cancelled"
              ? "https://schema.org/EventCancelled"
              : event.status === "postponed"
                ? "https://schema.org/EventPostponed"
                : "https://schema.org/EventScheduled",
          eventAttendanceMode:
            "https://schema.org/OfflineEventAttendanceMode",
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
            partner={event.partner}
            sponsor={event.sponsor}
            status={event.status}
            tags={event.tags}
            title={event.title}
            type={event.type}
          />
          <div className="w-full lg:w-[49%] lg:shrink-0">
            <AspectRatio
              className="relative w-full overflow-hidden rounded-lg"
              ratio={4 / 3}
            >
              {event.cover?.image?.asset ? (
                <SanityImage
                  className="rounded-lg object-cover"
                  fill
                  priority
                  source={event.cover}
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-neutral-200" />
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

        {/* Mobile-only metadata */}
        <div className="order-4 mt-6 flex flex-col gap-4 px-2.5 lg:hidden">
          {statusConfig ? (
            <Badge variant={statusConfig.badgeVariant}>
              {statusConfig.label}
            </Badge>
          ) : null}

          {showCta ? (
            <a href={event.ctaUrl!} rel="noopener noreferrer" target="_blank">
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
            {event.sponsor ? (
              <div className="flex gap-x-12">
                <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                  Sponsor
                </dt>
                <dd className="text-sm">{event.sponsor.name}</dd>
              </div>
            ) : null}
            {event.partner ? (
              <div className="flex gap-x-12">
                <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                  Partner
                </dt>
                <dd className="text-sm">{event.partner.name}</dd>
              </div>
            ) : null}
            {event.tags?.length ? (
              <div className="flex gap-x-12">
                <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                  Disciplines
                </dt>
                <dd>
                  <ul className="flex flex-col">
                    {event.tags.map(
                      (tag: { _id: string; name: string | null }) => (
                        <li className="text-sm underline" key={tag._id}>
                          {tag.name}
                        </li>
                      ),
                    )}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {/* Share Links */}
        <div className="order-5 px-2.5 pt-10">
          <ShareLinks title={event.title ?? ""} url={eventUrl} />
        </div>
      </div>
    </>
  );
}
