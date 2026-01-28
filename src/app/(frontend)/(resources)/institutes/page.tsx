import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { LanguagesDisplay } from "@/components/resources/languages-display";
import {
  CityDisplay,
  CountryDisplay,
} from "@/components/resources/location-display";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import PageHeader from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { sanityFetch } from "@/sanity/lib/live";
import { INSTITUTES_QUERY } from "@/sanity/lib/queries";
import type { INSTITUTES_QUERY_RESULT } from "@/sanity/types";

type Institute = INSTITUTES_QUERY_RESULT[number];

function InstituteCard({ institute }: { institute: Institute }) {
  return (
    <ResourceListItem>
      <li className="col-span-4">{institute.name}</li>
      <li className="col-span-2">
        <LanguagesDisplay languages={institute.languages} />
      </li>
      <li className="col-span-2">
        <CityDisplay location={institute.location} />
      </li>
      <li className="col-span-2">
        <CountryDisplay location={institute.location} />
      </li>
      <li className="col-span-2">{institute.yearFoundation || "-"}</li>
    </ResourceListItem>
  );
}

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
        {/* <SearchInput /> */}
      </div>

      <div className="space-y-0">
        <div className="sticky top-0 bg-background pt-16 pb-2.5">
          <div className="flex pb-2.5">
            <div className="flex-1">dropdown filter</div>
            <Input id="input-demo-api-key" placeholder="Search" type="search" />
          </div>
          <ul className="grid grid-cols-12 gap-2.5 rounded-md border px-2.5 py-2 font-mono text-xs uppercase">
            <li className="col-span-4">Name</li>
            <li className="col-span-2">Language</li>
            <li className="col-span-2">City</li>
            <li className="col-span-2">Country</li>
            <li className="col-span-2">Foundation</li>
          </ul>
        </div>
        <section className="flex flex-col gap-1.5">
          {institutes.length > 0 ? (
            institutes.map((institute) => (
              <InstituteCard institute={institute} key={institute._id} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No institutes available yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
