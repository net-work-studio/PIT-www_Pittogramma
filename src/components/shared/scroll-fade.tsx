"use client";

import type { MutableRefObject, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
}

export function ScrollFade({ children, className }: ScrollFadeProps) {
  const scrollRef = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement>;
  const [showFade, setShowFade] = useState(false);

  const updateFade = useCallback(() => {
    const element = scrollRef.current;
    const hasOverflow = element.scrollHeight > element.clientHeight;
    const atBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
    setShowFade(hasOverflow && !atBottom);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    updateFade();

    element.addEventListener("scroll", updateFade, { passive: true });
    const observer = new ResizeObserver(updateFade);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateFade);
      observer.disconnect();
    };
  }, [updateFade]);

  return (
    <div className={cn("relative min-h-0 bg-background", className)}>
      <div
        className="scrollbar-none h-full min-h-0 overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        {children}
      </div>
      {showFade ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/95 to-transparent"
        />
      ) : null}
    </div>
  );
}
