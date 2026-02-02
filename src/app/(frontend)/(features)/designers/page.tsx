import { Search } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import CtaCard from "@/components/cards/cta-card";
import Filter from "@/components/feat/filter/filter";
import PageHeader from "@/components/shared/page-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { sampleDesignersData } from "@/sample-data/sample-designers-data";
import { sanityFetch } from "@/sanity/lib/live";
import { DESIGNERS_PAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: DESIGNERS_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Designers",
      description: page?.introText,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/designers",
    siteDefaults,
  });
}

function DesignerCard() {
  return (
    <div className="flex flex-col gap-1">
      <AspectRatio className="relative" ratio={4 / 3}>
        <Image
          alt="Designer Card"
          className="rounded-lg bg-gray-600"
          fill
          src="https://placehold.co/400x300/png"
        />
      </AspectRatio>
      <ul className="flex justify-between">
        <li className="col-span-6">Name Designer</li>
        <li className="col-span-2">City, Country</li>
      </ul>
    </div>
  );
}

export default async function DesignersPage() {
  const { data: pageSettings } = await sanityFetch({
    query: DESIGNERS_PAGE_QUERY,
  });

  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle={pageSettings?.introText}
          title={pageSettings?.title ?? "Designers"}
        />
      </div>
      <div className="space-y-5 pt-30">
        <div className="flex justify-between">
          <Filter />
          <Search />
        </div>
        <section className="grid grid-cols-4 gap-2.5">
          {sampleDesignersData.map((_, index) => (
            <DesignerCard key={index} />
          ))}
        </section>
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
      </div>
    </>
  );
}
