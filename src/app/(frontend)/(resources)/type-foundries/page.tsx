import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ResourcesHeader from "@/components/navigation/resources-header";
import { TypeFoundriesContent } from "@/components/resources/type-foundries-content";
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
import { SITE_SETTINGS_QUERY, TYPE_FOUNDRIES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("type-foundries")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicTypeFoundriesPage />
      </Suspense>
    );
  }
  return <CachedTypeFoundriesPage perspective="published" stega={false} />;
}

async function DynamicTypeFoundriesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedTypeFoundriesPage perspective={perspective} stega={stega} />;
}

async function CachedTypeFoundriesPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: foundries }, { data: settings }] = await Promise.all([
    sanityFetch({ query: TYPE_FOUNDRIES_QUERY, perspective, stega }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, perspective, stega }),
  ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);

  return (
    <>
      <ResourcesHeader
        intro="A mapping of the creative realities around the world"
        title="Type Foundries"
      />
      <TypeFoundriesContent
        enabledViews={getEnabledViews("type-foundries")}
        foundries={foundries}
        searchEnabled={isSearchEnabled("type-foundries")}
        utmSettings={utmSettings}
      />
    </>
  );
}
