"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ProjectDescriptionProps {
  description: string | null;
}

export default function ProjectDescription({
  description,
}: ProjectDescriptionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  const updateFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const hasOverflow = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setShowFade(hasOverflow && !atBottom);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: description triggers re-measurement when text content changes
  useEffect(() => {
    updateFade();

    const el = scrollRef.current;
    if (!el) {
      return;
    }

    el.addEventListener("scroll", updateFade, { passive: true });
    const observer = new ResizeObserver(updateFade);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateFade);
      observer.disconnect();
    };
  }, [description, updateFade]);

  if (!description) {
    return null;
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        className="scrollbar-none h-full min-h-0 overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        <p>{description}</p>
      </div>
      {showFade ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"
        />
      ) : null}
    </div>
  );
}
