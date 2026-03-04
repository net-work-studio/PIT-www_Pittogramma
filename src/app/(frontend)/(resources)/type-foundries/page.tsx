import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { TypeFoundriesContent } from "@/components/resources/type-foundries-content";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { TYPE_FOUNDRIES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
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
        <ResourcesNavigation />
      </div>
      <TypeFoundriesContent foundries={foundries} />
    </>
  );
}
