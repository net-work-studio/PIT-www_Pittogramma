"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* autoplay can be blocked; ignore */
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      className={cn("h-full w-full object-cover", className)}
      loop
      muted
      playsInline
      poster={poster}
      preload="metadata"
      ref={videoRef}
      src={src}
    />
  );
}
