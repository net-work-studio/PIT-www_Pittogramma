"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/shared/location-map"), {
  ssr: false,
});

export default LocationMap;
