import { notFound } from "next/navigation";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { BookshopsContent } from "@/components/resources/bookshops-content";
import PageHeader from "@/components/shared/page-header";
import { getEnabledResources, getEnabledViews, isResourceEnabled, isSearchEnabled } from "@/lib/feature-flags";
import { sanityFetch } from "@/sanity/lib/live";
import { BOOKSHOPS_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("bookshops")) notFound();
  const { data: bookshops } = await sanityFetch({
    query: BOOKSHOPS_QUERY,
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
