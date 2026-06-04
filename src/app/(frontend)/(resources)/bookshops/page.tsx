import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { BookshopsContent } from "@/components/resources/bookshops-content";
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
import { BOOKSHOPS_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("bookshops")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicBookshopsPage />
      </Suspense>
    );
  }
  return <CachedBookshopsPage perspective="published" stega={false} />;
}

async function DynamicBookshopsPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedBookshopsPage perspective={perspective} stega={stega} />;
}

async function CachedBookshopsPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: bookshops } = await sanityFetch({
    query: BOOKSHOPS_QUERY,
    perspective,
    stega,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of independent bookshops around the world"
          title="Bookshops"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
      </div>
      <BookshopsContent
        bookshops={bookshops}
        enabledViews={getEnabledViews("bookshops")}
        searchEnabled={isSearchEnabled("bookshops")}
      />
    </>
  );
}
