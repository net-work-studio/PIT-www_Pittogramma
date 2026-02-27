import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { InstitutesContent } from "@/components/resources/institutes-content";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { INSTITUTES_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  const { data: institutes } = await sanityFetch({
    query: INSTITUTES_QUERY,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the institutes, schools and universities around the world"
          title="Institutes"
        />
        <ResourcesNavigation />
      </div>
      <InstitutesContent institutes={institutes} />
    </>
  );
}
