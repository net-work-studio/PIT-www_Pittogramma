"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Fix default marker icons for webpack/next.js bundling
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapPlace {
  _id: string;
  bookshops?: Array<{ _id: string; name: string | null }>;
  city: string | null;
  country: string | null;
  designers?: Array<{
    _id: string;
    name: string | null;
    slug: { current: string } | null;
  }>;
  institutes?: Array<{ _id: string; name: string | null }>;
  lat: number | null;
  lng: number | null;
  name: string | null;
  studios?: Array<{ _id: string; name: string | null }>;
  typeFoundries?: Array<{ _id: string; name: string | null }>;
}

interface LocationMapProps {
  className?: string;
  places: MapPlace[];
}

function FitBounds({ places }: { places: MapPlace[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(
      places
        .filter(
          (p: MapPlace): p is MapPlace & { lat: number; lng: number } =>
            p.lat != null && p.lng != null
        )
        .map((p: MapPlace & { lat: number; lng: number }) =>
          L.latLng(p.lat, p.lng)
        )
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [map, places]);

  return null;
}

function buildPopupContent(place: MapPlace): string {
  const sections: string[] = [];

  if (place.designers?.length) {
    const links = place.designers.map((d) => {
      const slug = d.slug?.current;
      return slug
        ? `<a href="/designers/${slug}" style="color:#2563eb;text-decoration:underline">${d.name}</a>`
        : d.name;
    });
    sections.push(`<strong>Designers:</strong> ${links.join(", ")}`);
  }

  if (place.studios?.length) {
    sections.push(
      `<strong>Studios:</strong> ${place.studios.map((s) => s.name).join(", ")}`
    );
  }

  if (place.institutes?.length) {
    sections.push(
      `<strong>Institutes:</strong> ${place.institutes.map((i) => i.name).join(", ")}`
    );
  }

  if (place.bookshops?.length) {
    sections.push(
      `<strong>Bookshops:</strong> ${place.bookshops.map((b) => b.name).join(", ")}`
    );
  }

  if (place.typeFoundries?.length) {
    sections.push(
      `<strong>Type Foundries:</strong> ${place.typeFoundries.map((t) => t.name).join(", ")}`
    );
  }

  return sections.join("<br/>");
}

export default function LocationMap({ places, className }: LocationMapProps) {
  const validPlaces = places.filter(
    (p: MapPlace): p is MapPlace & { lat: number; lng: number } =>
      p.lat != null && p.lng != null
  );

  if (validPlaces.length === 0) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground">
          No locations with coordinates available.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={[45, 10]}
        scrollWheelZoom
        style={{
          height: "100%",
          width: "100%",
          minHeight: 400,
          borderRadius: "0.75rem",
        }}
        zoom={4}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds places={validPlaces} />
        {validPlaces.map((place: MapPlace & { lat: number; lng: number }) => (
          <Marker key={place._id} position={[place.lat, place.lng]}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{place.name}</strong>
                <br />
                <span
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content is built from trusted Sanity data
                  dangerouslySetInnerHTML={{
                    __html: buildPopupContent(place),
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
