import type { Metadata } from "next";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { BibliographyContent } from "@/components/resources/bibliography-content";
import PageHeader from "@/components/shared/page-header";
import type { UtmSettings } from "@/lib/tracked-link";
import { sanityFetch } from "@/sanity/lib/live";
import { BIBLIOGRAPHY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Bibliography",
  description: "A constantly updated list of books on graphic design",
};

export default async function Page() {
  const [{ data: books }, { data: settings }] = await Promise.all([
    sanityFetch({ query: BIBLIOGRAPHY_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const utmSettings: UtmSettings = {
    utmSource: settings?.utmSource,
    utmMedium: settings?.utmMedium,
    utmCampaign: settings?.utmCampaign,
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A constantly updated list of books on graphic design"
          title="Resources"
        />
        <ResourcesNavigation />
      </div>
      <BibliographyContent books={books} utmSettings={utmSettings} />
    </>
  );
}
