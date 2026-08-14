"use client";

import type { ReactNode } from "react";
import type { JournalFootnote } from "@/components/modules/journal/journal-footnotes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function FootnoteMarker({
  children,
  footnote,
  number,
}: {
  children: ReactNode;
  footnote: JournalFootnote;
  number: number;
}) {
  const footnoteId = `footnote-${number}`;
  const markerId = `footnote-ref-${number}`;

  return (
    <>
      {children}
      <sup className="ml-0.5 inline-flex align-super">
        <Popover>
          <PopoverTrigger
            closeDelay={200}
            delay={100}
            nativeButton={false}
            openOnHover
            render={
              <a
                aria-label={`Footnote ${number}: ${footnote.note}`}
                className="inline-flex min-w-4 items-center justify-center rounded-full bg-yellow-100 px-1 font-mono text-xxs leading-4 no-underline transition-colors hover:bg-yellow-200 focus-visible:bg-yellow-200 focus-visible:outline-1 focus-visible:outline-ring"
                href={`#${footnoteId}`}
                id={markerId}
                role="doc-noteref"
              >
                {number}
              </a>
            }
          />
          <PopoverContent initialFocus={false} side="top">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {footnote.note}
            </p>
            {footnote.url ? (
              <a
                className="mt-2 inline-flex font-mono text-xs underline underline-offset-2"
                href={footnote.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open source ↗
              </a>
            ) : null}
          </PopoverContent>
        </Popover>
      </sup>
    </>
  );
}
