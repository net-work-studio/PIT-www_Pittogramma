import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { STUDIOS_QUERY } from "@/sanity/lib/queries";
import type { STUDIOS_QUERY_RESULT } from "@/sanity/types";

type Studio = STUDIOS_QUERY_RESULT[number];

function getCities(locations: Studio["locations"]) {
  if (!locations || locations.length === 0) {
    return "-";
  }
  const cities: string[] = [];
  for (const loc of locations) {
    if (loc.city?.name) {
      cities.push(loc.city.name);
    }
  }
  return cities.length > 0 ? cities.join(", ") : "-";
}

function getCountries(locations: Studio["locations"]) {
  if (!locations || locations.length === 0) {
    return "-";
  }
  const uniqueCountries = new Set<string>();
  for (const loc of locations) {
    if (loc.country?.name) {
      uniqueCountries.add(loc.country.name);
    }
  }
  return uniqueCountries.size > 0
    ? Array.from(uniqueCountries).join(", ")
    : "-";
}

function StudioCard({ studio }: { studio: Studio }) {
  return (
    <ResourceListItem>
      <li className="col-span-4">{studio.name}</li>
      <li className="col-span-2">{studio.category?.name || "-"}</li>
      <li className="col-span-2">
        <TagsDisplay tags={studio.tagSelector?.tags} />
      </li>
      <li className="col-span-2">{getCities(studio.locations)}</li>
      <li className="col-span-2">{getCountries(studio.locations)}</li>
    </ResourceListItem>
  );
}

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
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-4">Name</li>
          <li className="col-span-2">Category</li>
          <li className="col-span-2">Tag</li>
          <li className="col-span-2">City</li>
          <li className="col-span-2">Country</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {studios.length > 0 ? (
            studios.map((studio: Studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No studios or agencies available yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
