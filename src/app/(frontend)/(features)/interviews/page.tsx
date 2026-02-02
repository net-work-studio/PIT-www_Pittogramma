import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  INTERVIEWS_PAGE_QUERY,
  INTERVIEWS_QUERY,
} from "@/sanity/lib/queries";
import type { INTERVIEWS_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: INTERVIEWS_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Interviews",
      description: page?.introText,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/interviews",
    siteDefaults,
  });
}

export default async function InterviewsPage() {
  const [{ data: interviews }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: INTERVIEWS_QUERY }),
    sanityFetch({ query: INTERVIEWS_PAGE_QUERY }),
  ]);

  const cta = pageSettings?.endOfPageCta;

  const interviewCards = interviews.map(
    (interview: INTERVIEWS_QUERY_RESULT[number]) => {
      const image = interview.cover?.image
        ? urlFor(interview.cover.image).width(1200).height(900).url()
        : "";

      return {
        authors: interview.designers?.length
          ? interview.designers.map((d) => ({ name: d.name ?? "" }))
          : undefined,
        href: `/interviews/${interview.slug?.current}`,
        id: interview._id,
        image,
        title: interview.title,
        readingTime: interview.readingTime,
        studio: interview.studio?.name,
        location:
          [interview.city?.name, interview.country?.name]
            .filter(Boolean)
            .join(", ") || undefined,
      };
    }
  );

  return (
    <>
      <PageHeader
        subtitle={pageSettings?.introText}
        title={pageSettings?.title ?? "Interviews"}
      />
      <div className="space-y-10 pb-10">
        <div>
          <Button className="font-mono uppercase">Filters</Button>
        </div>
        <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
          {interviewCards.map((card) => (
            <BaseCard
              authors={card.authors}
              href={card.href}
              image={card.image}
              key={card.id}
              title={card.title}
            />
          ))}
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
