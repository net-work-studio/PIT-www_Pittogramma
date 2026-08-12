import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ResourcesHeader from "@/components/navigation/resources-header";
import { WebsitesContent } from "@/components/resources/websites-content";
import {
  getEnabledViews,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
import { utmSettingsFromSiteSettings } from "@/lib/tracked-link";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, WEB_SOURCES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("websites")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicWebsitesPage />
      </Suspense>
    );
  }
  return <CachedWebsitesPage perspective="published" stega={false} />;
}

async function DynamicWebsitesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedWebsitesPage perspective={perspective} stega={stega} />;
}

async function CachedWebsitesPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [{ data: sources }, { data: settings }] = await Promise.all([
    sanityFetch({ query: WEB_SOURCES_QUERY, perspective, stega }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, perspective, stega }),
  ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);

  return (
    <>
      <ResourcesHeader
        intro="A curated list of websites and online resources for designers"
        title="Websites"
      />
      <WebsitesContent
        enabledViews={getEnabledViews("websites")}
        searchEnabled={isSearchEnabled("websites")}
        sources={sources}
        utmSettings={utmSettings}
      />
    </>
  );
}
