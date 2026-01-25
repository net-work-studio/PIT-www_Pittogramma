"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";
import { urlForImage } from "@/sanity/lib/image";
import type { BIBLIOGRAPHY_QUERY_RESULT } from "@/sanity/types";

type BookItem = BIBLIOGRAPHY_QUERY_RESULT[number];

interface BookDetailsDrawerProps {
  book: BookItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  utmSettings?: UtmSettings;
}

function getAuthors(authors: BookItem["authors"]) {
  if (!authors || authors.length === 0) {
    return null;
  }
  return authors.map((author) => author.name).join(", ");
}

export function BookDetailsDrawer({
  book,
  open,
  onOpenChange,
  utmSettings,
}: BookDetailsDrawerProps) {
  if (!book) return null;

  const coverUrl = urlForImage(book.cover)?.width(400).height(600).url();
  const authors = getAuthors(book.authors);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{book.name}</SheetTitle>
          {authors && <SheetDescription>{authors}</SheetDescription>}
        </SheetHeader>

        <div className="flex flex-col gap-6 p-6">
          {coverUrl && (
            <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-md bg-muted">
              <Image
                src={coverUrl}
                alt={book.cover?.alt || book.name || "Book cover"}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {book.publisher?.name && (
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  Publisher
                </p>
                <p className="font-medium">{book.publisher.name}</p>
              </div>
            )}

            {book.year && (
              <div>
                <p className="text-muted-foreground text-xs uppercase">Year</p>
                <p className="font-medium">{book.year}</p>
              </div>
            )}

            {book.pageCount && (
              <div>
                <p className="text-muted-foreground text-xs uppercase">Pages</p>
                <p className="font-medium">{book.pageCount}</p>
              </div>
            )}

            {book.isbn && (
              <div>
                <p className="text-muted-foreground text-xs uppercase">ISBN</p>
                <p className="font-medium font-mono text-sm">{book.isbn}</p>
              </div>
            )}

            {book.categories && book.categories.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  Categories
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {book.categories.map((category, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {book.description && (
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  Description
                </p>
                <p className="pt-1 text-sm leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}
          </div>

          {book.affiliateLink && (
            <Button asChild className="mt-auto w-full">
              <a
                href={buildTrackedLink(book.affiliateLink, "book", utmSettings)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy
              </a>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
