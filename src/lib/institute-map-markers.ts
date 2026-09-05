import type { INSTITUTES_QUERY_RESULT } from "@/sanity/types";

export function getInstituteMarkers(institutes: INSTITUTES_QUERY_RESULT) {
  return institutes.flatMap((institute) => {
    const place = institute.place;

    if (!place || place.lat === null || place.lng === null) {
      return [];
    }

    return [
      {
        id: institute._id,
        lat: place.lat,
        lng: place.lng,
        name: institute.name ?? "",
      },
    ];
  });
}
