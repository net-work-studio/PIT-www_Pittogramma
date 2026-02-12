import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { EVENTS_PAGE_QUERY } from "@/sanity/lib/queries";

const futureEvents = [
  {
    id: "1",
    title: "Typography Masterclass",
    authors: [{ name: "Sarah Chen" }, { name: "Alex Rivera" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2025-02-15",
    location: "Milan Design Week",
  },
  {
    id: "2",
    title: "Design Trends 2025",
    authors: [{ name: "Maria Garcia" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2025-03-20",
    location: "Online",
  },
  {
    id: "3",
    title: "Portfolio Review Session",
    authors: [{ name: "John Smith" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2025-04-10",
    location: "Studio Space",
  },
  {
    id: "4",
    title: "Brand Identity Workshop",
    authors: [{ name: "Emma Wilson" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2025-05-05",
    location: "Design Institute",
  },
];

const pastEvents = [
  {
    id: "5",
    title: "Design Conference 2024",
    authors: [{ name: "Conference Team" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2024-11-15",
    location: "Convention Center",
  },
  {
    id: "6",
    title: "Print Design Symposium",
    authors: [{ name: "Print Collective" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2024-10-08",
    location: "Art Gallery",
  },
  {
    id: "7",
    title: "Digital Art Exhibition",
    authors: [{ name: "Digital Artists" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2024-09-22",
    location: "Museum of Design",
  },
  {
    id: "8",
    title: "Student Portfolio Show",
    authors: [{ name: "Design Students" }],
    image: "https://placehold.co/400x300/png",
    href: "/",
    date: "2024-08-30",
    location: "University Campus",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: EVENTS_PAGE_QUERY,
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

export default async function Page() {
  const { data: pageSettings } = await sanityFetch({
    query: EVENTS_PAGE_QUERY,
  });

  const cta = pageSettings?.endOfPageCta;

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
