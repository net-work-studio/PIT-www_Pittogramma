import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import {
  CityDisplay,
  CountryDisplay,
} from "@/components/resources/location-display";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { BOOKSHOPS_QUERY } from "@/sanity/lib/queries";
import type { BOOKSHOPS_QUERY_RESULT } from "@/sanity/types";

type Bookshop = BOOKSHOPS_QUERY_RESULT[number];

function BookshopCard({ bookshop }: { bookshop: Bookshop }) {
  return (
    <ResourceListItem>
      <li className="col-span-6">{bookshop.name}</li>
      <li className="col-span-3">
        <CityDisplay location={bookshop.location} />
      </li>
      <li className="col-span-3">
        <CountryDisplay location={bookshop.location} />
      </li>
    </ResourceListItem>
  );
}

export default async function Page() {
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
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-6">Name</li>
          <li className="col-span-3">City</li>
          <li className="col-span-3">Country</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {bookshops.length > 0 ? (
            bookshops.map((bookshop) => (
              <BookshopCard bookshop={bookshop} key={bookshop._id} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No bookshops available yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
