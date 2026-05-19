import type { MapPlace } from "@/components/shared/location-map";
import LocationMap from "@/components/shared/location-map-wrapper";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { MAP_DATA_QUERY } from "@/sanity/lib/queries";

interface MapReferenceItem {
  _id: string;
  name: string | null;
  placeId?: string | null;
  placeIds?: string[] | null;
  slug?: { current: string } | null;
}

interface MapData {
  bookshops: MapReferenceItem[];
  designers: MapReferenceItem[];
  institutes: MapReferenceItem[];
  places: Omit<
    MapPlace,
    "bookshops" | "designers" | "institutes" | "studios" | "typeFoundries"
  >[];
  studios: MapReferenceItem[];
  typeFoundries: MapReferenceItem[];
}

function byPlaceId(items: MapReferenceItem[]): Map<string, MapReferenceItem[]> {
  const map = new Map<string, MapReferenceItem[]>();

  for (const item of items) {
    const placeIds = item.placeIds ?? (item.placeId ? [item.placeId] : []);
    for (const placeId of placeIds) {
      const existing = map.get(placeId) ?? [];
      existing.push(item);
      map.set(placeId, existing);
    }
  }

  return map;
}

function mapSimpleItems(
  items: MapReferenceItem[]
): Array<{ _id: string; name: string | null }> {
  return items.map((item) => ({ _id: item._id, name: item.name }));
}

function composeMapPlaces(data: MapData): MapPlace[] {
  const designers = byPlaceId(data.designers);
  const bookshops = byPlaceId(data.bookshops);
  const studios = byPlaceId(data.studios);
  const institutes = byPlaceId(data.institutes);
  const typeFoundries = byPlaceId(data.typeFoundries);

  return data.places.map((place) => ({
    ...place,
    designers: (designers.get(place._id) ?? []).map((designer) => ({
      _id: designer._id,
      name: designer.name,
      slug: designer.slug ?? null,
    })),
    bookshops: mapSimpleItems(bookshops.get(place._id) ?? []),
    studios: mapSimpleItems(studios.get(place._id) ?? []),
    institutes: mapSimpleItems(institutes.get(place._id) ?? []),
    typeFoundries: mapSimpleItems(typeFoundries.get(place._id) ?? []),
  }));
}

export default async function MapPage() {
  const { data } = await sanityFetch({
    query: MAP_DATA_QUERY,
  });
  const places = composeMapPlaces(data as MapData);

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
