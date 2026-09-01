"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ShareLinksProps {
  title: string;
  url: string;
}

const platforms = [
  {
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    name: "LinkedIn",
  },
  {
    getUrl: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    name: "Pinterest",
  },
  {
    getUrl: (url: string, title: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    name: "X",
  },
  {
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    name: "WhatsApp",
  },
];

export default function ShareLinks({ url, title }: ShareLinksProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const handleCopyLink = useCallback(() => {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
          timeoutRef.current = null;
        }, 2000);
      })
      .catch(() => {
        setIsCopied(false);
      });
  }, [url]);

  return (
    <div className="mt-10 flex flex-wrap items-baseline gap-2.5">
      <span className="font-mono text-muted-foreground text-sm uppercase">
        Share
      </span>
      <div className="relative">
        <button
          aria-label="Copy link"
          className="inline-flex items-center gap-1 text-sm underline decoration-1 underline-offset-2 hover:cursor-pointer hover:text-muted-foreground"
          onClick={handleCopyLink}
          type="button"
        >
          Copy Link
        </button>
        {isCopied ? (
          <span
            className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full bg-foreground px-2 py-1 text-background text-xs"
            role="status"
          >
            Copied!
          </span>
        ) : null}
      </div>
      {platforms.map((platform) => (
        <a
          className="text-sm underline decoration-1 underline-offset-2 hover:text-muted-foreground"
          href={platform.getUrl(url, title)}
          key={platform.name}
          rel="noopener noreferrer"
          target="_blank"
        >
          {platform.name}
        </a>
      ))}
    </div>
  );
}
