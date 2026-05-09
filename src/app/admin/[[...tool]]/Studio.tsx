"use client";

import dynamic from "next/dynamic";

const StudioContent = dynamic(() => import("./StudioContent"), { ssr: false });

export default function Studio() {
  return <StudioContent />;
}
