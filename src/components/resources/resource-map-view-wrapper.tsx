"use client";

import dynamic from "next/dynamic";

const ResourceMapView = dynamic(
  () => import("@/components/resources/resource-map-view"),
  { ssr: false }
);

export default ResourceMapView;
