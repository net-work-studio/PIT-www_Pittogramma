"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();

  // Only show the disable draft mode button when outside of Presentation Tool
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  return (
    <a
      className="fixed right-4 bottom-4 bg-gray-50 px-4 py-2"
      href="/api/draft-mode/disable"
    >
      Disable Draft Mode
    </a>
  );
}
