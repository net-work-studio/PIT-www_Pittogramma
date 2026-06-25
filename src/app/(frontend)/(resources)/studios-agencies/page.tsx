import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { StudiosContent } from "@/components/resources/studios-content";
import PageHeader from "@/components/shared/page-header";
import {
  getEnabledResources,
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
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the creative realities around the world"
          title="Studios & Agencies"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
      </div>
      <StudiosContent
        enabledViews={getEnabledViews("studios-agencies")}
        searchEnabled={isSearchEnabled("studios-agencies")}
        studios={studios}
        utmSettings={utmSettings}
      />
    </>
  );
}
