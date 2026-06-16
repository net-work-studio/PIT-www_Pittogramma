import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { InstitutesContent } from "@/components/resources/institutes-content";
import PageHeader from "@/components/shared/page-header";
import {
  getEnabledResources,
  getEnabledViews,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { INSTITUTES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("institutes")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicInstitutesPage />
      </Suspense>
    );
  }
  return <CachedInstitutesPage perspective="published" stega={false} />;
}

async function DynamicInstitutesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedInstitutesPage perspective={perspective} stega={stega} />;
}

async function CachedInstitutesPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: institutes } = await sanityFetch({
    query: INSTITUTES_QUERY,
    perspective,
    stega,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the institutes, schools and universities around the world"
          title="Institutes"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
      </div>
      <InstitutesContent
        enabledViews={getEnabledViews("institutes")}
        institutes={institutes}
        searchEnabled={isSearchEnabled("institutes")}
      />
    </>
  );
}
