import HomeGrid from "@/components/home-grid";
import PageHeader from "@/components/shared/page-header";

import { sampleHomeData } from "@/sample-data/sample-home-data";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const { data: siteSettings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
  });
  return (
    <>
      <PageHeader subtitle={siteSettings?.homeIntro} title="Pittogramma" />
      <HomeGrid data={sampleHomeData} />
    </>
  );
}
