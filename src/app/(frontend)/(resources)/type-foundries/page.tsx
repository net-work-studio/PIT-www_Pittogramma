import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { TypeFoundriesContent } from "@/components/resources/type-foundries-content";
import PageHeader from "@/components/shared/page-header";
import {
  getEnabledResources,
  getEnabledViews,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
import {
  getDynamicFetchOptions,
  sanityFetch,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { TYPE_FOUNDRIES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("type-foundries")) {
    notFound();
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

async function CachedTypeFoundriesPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data: foundries } = await sanityFetch({
    query: TYPE_FOUNDRIES_QUERY,
    perspective,
    stega,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the creative realities around the world"
          title="Type Foundries"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
      </div>
      <TypeFoundriesContent
        enabledViews={getEnabledViews("type-foundries")}
        foundries={foundries}
        searchEnabled={isSearchEnabled("type-foundries")}
      />
    </>
  );
}
