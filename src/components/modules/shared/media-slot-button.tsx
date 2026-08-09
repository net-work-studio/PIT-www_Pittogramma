"use client";

import { type ReactNode, useCallback } from "react";
import type { MediaItemShape } from "./media-blocks";

interface MediaSlotButtonProps {
  children: ReactNode;
  media: MediaItemShape;
  onMediaClick: (media: MediaItemShape) => void;
}

export default function MediaSlotButton({
  children,
  media,
  onMediaClick,
}: MediaSlotButtonProps) {
  const handleClick = useCallback(
    () => onMediaClick(media),
    [media, onMediaClick]
  );

  return (
    <div className="relative">
      {children}
      <button
        aria-label={`Open gallery item: ${media.alt ?? media.caption ?? "media"}`}
        className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-ring"
        onClick={handleClick}
        type="button"
      />
    </div>
  );
}
