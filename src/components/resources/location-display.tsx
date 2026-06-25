import type { ReactNode } from "react";

interface PlaceData {
  _id?: string;
  city?: string | null;
  country?: string | null;
}

function PlacesStack({
  places,
  renderPlace,
}: {
  places: PlaceData[] | null | undefined;
  renderPlace: (place: PlaceData) => ReactNode;
}) {
  if (!places?.length) {
    return <>-</>;
  }

  if (places.length === 1) {
    return <>{renderPlace(places[0])}</>;
  }

  return (
    <div className="flex flex-col">
      {places.map((place, index) => (
        <span key={place._id ?? index}>{renderPlace(place)}</span>
      ))}
    </div>
  );
}

interface LocationDisplayProps {
  place: PlaceData | null | undefined;
  showCity?: boolean;
  showCountry?: boolean;
}

export function LocationDisplay({
  place,
  showCity = true,
  showCountry = true,
}: LocationDisplayProps) {
  if (!place) {
    return null;
  }

  if (showCity && showCountry) {
    return (
      <>
        {place.city || "-"}
        {", "}
        {place.country || "-"}
      </>
    );
  }

  if (showCity) {
    return <>{place.city || "-"}</>;
  }

  if (showCountry) {
    return <>{place.country || "-"}</>;
  }

  return null;
}

export function CityDisplay({
  place,
}: {
  place: PlaceData | null | undefined;
}) {
  return <LocationDisplay place={place} showCity showCountry={false} />;
}

export function CountryDisplay({
  place,
}: {
  place: PlaceData | null | undefined;
}) {
  return <LocationDisplay place={place} showCity={false} showCountry />;
}

export function PlacesCityDisplay({
  places,
}: {
  places: PlaceData[] | null | undefined;
}) {
  return (
    <PlacesStack
      places={places}
      renderPlace={(place) => <CityDisplay place={place} />}
    />
  );
}

export function PlacesCountryDisplay({
  places,
}: {
  places: PlaceData[] | null | undefined;
}) {
  return (
    <PlacesStack
      places={places}
      renderPlace={(place) => <CountryDisplay place={place} />}
    />
  );
}

export function PlacesLocationDisplay({
  places,
}: {
  places: PlaceData[] | null | undefined;
}) {
  return (
    <PlacesStack
      places={places}
      renderPlace={(place) => <LocationDisplay place={place} />}
    />
  );
}
