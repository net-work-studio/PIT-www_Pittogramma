import { notFound } from "next/navigation";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { WebsitesContent } from "@/components/resources/websites-content";
import PageHeader from "@/components/shared/page-header";
import {
  getEnabledResources,
  getEnabledViews,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
import type { UtmSettings } from "@/lib/tracked-link";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, WEB_SOURCES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("websites")) {
    notFound();
  }
  const [{ data: sources }, { data: settings }] = await Promise.all([
    sanityFetch({ query: WEB_SOURCES_QUERY }),
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
          subtitle="A curated list of websites and online resources for designers"
          title="Websites"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
      </div>
      <WebsitesContent
        enabledViews={getEnabledViews("websites")}
        searchEnabled={isSearchEnabled("websites")}
        sources={sources}
        utmSettings={utmSettings}
      />
    </>
  );
}
