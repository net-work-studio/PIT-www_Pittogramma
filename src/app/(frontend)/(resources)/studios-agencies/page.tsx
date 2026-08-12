import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ResourcesHeader from "@/components/navigation/resources-header";
import { StudiosContent } from "@/components/resources/studios-content";
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
import { SITE_SETTINGS_QUERY, STUDIOS_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("studios-agencies")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicStudiosPage />
      </Suspense>
    );
  }
  return <CachedStudiosPage perspective="published" stega={false} />;
}

async function DynamicStudiosPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedStudiosPage perspective={perspective} stega={stega} />;
}

async function CachedStudiosPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [{ data: studios }, { data: settings }] = await Promise.all([
    sanityFetch({ query: STUDIOS_QUERY, perspective, stega }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, perspective, stega }),
  ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);

  return (
    <>
      <ResourcesHeader
        intro="A mapping of the creative realities around the world"
        title="Studios & Agencies"
      />
      <StudiosContent
        enabledViews={getEnabledViews("studios-agencies")}
        searchEnabled={isSearchEnabled("studios-agencies")}
        studios={studios}
        utmSettings={utmSettings}
      />
    </>
  );
}
