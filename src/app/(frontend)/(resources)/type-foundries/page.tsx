import { notFound } from "next/navigation";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { TypeFoundriesContent } from "@/components/resources/type-foundries-content";
import PageHeader from "@/components/shared/page-header";
import { getEnabledResources, getEnabledViews, isResourceEnabled, isSearchEnabled } from "@/lib/feature-flags";
import { sanityFetch } from "@/sanity/lib/live";
import { TYPE_FOUNDRIES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  if (!isResourceEnabled("type-foundries")) notFound();
  const { data: foundries } = await sanityFetch({
    query: TYPE_FOUNDRIES_QUERY,
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
        foundries={foundries}
        enabledViews={getEnabledViews("type-foundries")}
        searchEnabled={isSearchEnabled("type-foundries")}
      />
    </>
  );
}
