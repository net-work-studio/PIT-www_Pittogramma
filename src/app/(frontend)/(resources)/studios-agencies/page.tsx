import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { StudiosContent } from "@/components/resources/studios-content";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { STUDIOS_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  const { data: studios } = await sanityFetch({
    query: STUDIOS_QUERY,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the creative realities around the world"
          title="Studios & Agencies"
        />
        <ResourcesNavigation />
      </div>
      <StudiosContent studios={studios} />
    </>
  );
}
