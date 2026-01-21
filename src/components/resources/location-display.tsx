interface LocationData {
  country?: { _id: string; name: string } | null;
  city?: { _id: string; name: string } | null;
}

interface LocationDisplayProps {
  location: LocationData | null | undefined;
  showCity?: boolean;
  showCountry?: boolean;
}

export function LocationDisplay({
  location,
  showCity = true,
  showCountry = true,
}: LocationDisplayProps) {
  if (!location) {
    return null;
  }

  if (showCity && showCountry) {
    return (
      <>
        {location.city?.name || "-"}
        {", "}
        {location.country?.name || "-"}
      </>
    );
  }

  if (showCity) {
    return <>{location.city?.name || "-"}</>;
  }

  if (showCountry) {
    return <>{location.country?.name || "-"}</>;
  }

  return null;
}

export function CityDisplay({
  location,
}: {
  location: LocationData | null | undefined;
}) {
  return <LocationDisplay location={location} showCity showCountry={false} />;
}

export function CountryDisplay({
  location,
}: {
  location: LocationData | null | undefined;
}) {
  return <LocationDisplay location={location} showCity={false} showCountry />;
}
