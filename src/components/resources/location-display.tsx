interface PlaceData {
  city?: string | null;
  country?: string | null;
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
