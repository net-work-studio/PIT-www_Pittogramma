"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

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

export interface ResourceMapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface ResourceMapViewProps {
  className?: string;
  markers: ResourceMapMarker[];
}

function FitBounds({ markers }: { markers: ResourceMapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(markers.map((m) => L.latLng(m.lat, m.lng)));

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [map, markers]);

  return null;
}

export default function ResourceMapView({
  markers,
  className,
}: ResourceMapViewProps) {
  if (markers.length === 0) {
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
          minHeight: 500,
          borderRadius: "0.75rem",
        }}
        zoom={4}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
