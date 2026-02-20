import type { Metadata } from "next";
import CtaCard from "@/components/cards/cta-card";
import HomeGrid from "@/components/home-grid";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { sampleHomeData } from "@/sample-data/sample-home-data";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: HOME_PAGE_QUERY,
    stega: false,
  });

  return mapSanityToMetadata({
    page: {
      title: siteDefaults.title,
      description: siteDefaults.description,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/",
    siteDefaults,
  });
}

export default async function Home() {
  const [{ data: siteSettings }, { data: homePage }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: HOME_PAGE_QUERY }),
  ]);

  const cta = homePage?.endOfPageCta;

  return (
    <>
      <PageHeader subtitle={homePage?.introText} title="Pittogramma" />
      <HomeGrid data={sampleHomeData} />
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
