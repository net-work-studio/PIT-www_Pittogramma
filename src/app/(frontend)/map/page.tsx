import LocationMap from "@/components/shared/location-map-wrapper";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { MAP_PLACES_QUERY } from "@/sanity/lib/queries";

export default async function MapPage() {
  const { data: places } = await sanityFetch({
    query: MAP_PLACES_QUERY,
  });

  return (
    <>
      <PageHeader
        subtitle="Explore designers, studios, bookshops, institutes, and type foundries around the world"
        title="Map"
      />
      <div className="h-[calc(100vh-300px)] min-h-[500px]">
        <LocationMap className="h-full w-full" places={places} />
      </div>
    </>
  );
}
