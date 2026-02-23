import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { TYPE_FOUNDRIES_QUERY } from "@/sanity/lib/queries";
import type { TYPE_FOUNDRIES_QUERY_RESULT } from "@/sanity/types";

type TypeFoundry = TYPE_FOUNDRIES_QUERY_RESULT[number];

function getCities(places: TypeFoundry["places"]) {
  if (!places || places.length === 0) {
    return "-";
  }
  const cities: string[] = [];
  for (const place of places) {
    if (place?.city) {
      cities.push(place.city);
    }
  }
  return cities.length > 0 ? cities.join(", ") : "-";
}

function getCountries(places: TypeFoundry["places"]) {
  if (!places || places.length === 0) {
    return "-";
  }
  const uniqueCountries = new Set<string>();
  for (const place of places) {
    if (place?.country) {
      uniqueCountries.add(place.country);
    }
  }
  return uniqueCountries.size > 0
    ? Array.from(uniqueCountries).join(", ")
    : "-";
}

function TypeFoundryCard({ foundry }: { foundry: TypeFoundry }) {
  return (
    <ResourceListItem>
      <li className="col-span-4">{foundry.name}</li>
      <li className="col-span-4">
        <TagsDisplay tags={foundry.tagSelector?.tags} />
      </li>
      <li className="col-span-2">{getCities(foundry.places)}</li>
      <li className="col-span-2">{getCountries(foundry.places)}</li>
    </ResourceListItem>
  );
}

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
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-4">Name</li>
          <li className="col-span-4">Tag</li>
          <li className="col-span-2">City</li>
          <li className="col-span-2">Country</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {foundries.length > 0 ? (
            foundries.map((foundry: TypeFoundry) => (
              <TypeFoundryCard foundry={foundry} key={foundry._id} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No type foundries available yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
