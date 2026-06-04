"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) {
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
