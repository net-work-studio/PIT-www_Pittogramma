import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { getBlurDataUrl, urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { EVENTS_PAGE_QUERY, EVENTS_QUERY } from "@/sanity/lib/queries";
import type { EVENTS_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: EVENTS_PAGE_QUERY,
    stega: false,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Events",
      description: page?.introText,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/events",
    siteDefaults,
  });
}

interface EventCard {
  authors: { name: string }[] | undefined;
  blurDataURL: string | undefined;
  href: string;
  id: string;
  image: string;
  title: string;
}

function mapEventToCard(event: EVENTS_QUERY_RESULT[number]): EventCard {
  const image = event.cover?.image
    ? urlFor(event.cover.image).width(800).height(600).url()
    : "";

  const subtitle = event.locationName ?? event.type;

  return {
    authors: subtitle ? [{ name: subtitle }] : undefined,
    blurDataURL: getBlurDataUrl(event.cover),
    href: `/events/${event.slug?.current}`,
    id: event._id,
    image,
    title: event.title,
  };
}

export default async function Page() {
  const [{ data: events }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: EVENTS_QUERY }),
    sanityFetch({ query: EVENTS_PAGE_QUERY }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const now = new Date().toISOString().split("T")[0];
  const typedEvents = events as EVENTS_QUERY_RESULT;

  const futureEvents = typedEvents
    .filter((e) => e.slug?.current && e.dateStart >= now)
    .map(mapEventToCard);

  const pastEvents = typedEvents
    .filter((e) => e.slug?.current && e.dateStart < now)
    .map(mapEventToCard);

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

        <section>
          <h2 className="mb-6 border-b pb-2 font-mono text-sm uppercase">
            Next
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {futureEvents.map((event) => (
              <BaseCard
                authors={event.authors}
                blurDataURL={event.blurDataURL}
                href={event.href}
                image={event.image}
                key={event.id}
                title={event.title}
                variant="event"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 border-b pb-2 font-mono text-sm uppercase">
            Past
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastEvents.map((event) => (
              <BaseCard
                authors={event.authors}
                blurDataURL={event.blurDataURL}
                href={event.href}
                image={event.image}
                key={event.id}
                title={event.title}
                variant="event"
              />
            ))}
          </div>
        </section>
        <div className="flex items-center justify-center gap-2">
          <Button className="rounded-full font-mono uppercase">1</Button>
          <Button className="rounded-full font-mono uppercase">2</Button>
          <Button className="rounded-full font-mono uppercase">3</Button>
        </div>
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
