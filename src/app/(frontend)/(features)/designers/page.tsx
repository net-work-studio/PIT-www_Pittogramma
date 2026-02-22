import { Search } from "lucide-react";
import type { Metadata } from "next";
import CtaCard from "@/components/cards/cta-card";
import Filter from "@/components/feat/filter/filter";
import DesignerGrid from "@/components/modules/designer/designer-grid";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { DESIGNERS_PAGE_QUERY, DESIGNERS_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: DESIGNERS_PAGE_QUERY,
    stega: false,
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

export default async function DesignersPage() {
  const [{ data: designers }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: DESIGNERS_QUERY }),
    sanityFetch({ query: DESIGNERS_PAGE_QUERY }),
  ]);

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
        <DesignerGrid designers={designers} />
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
