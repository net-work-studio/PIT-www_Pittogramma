"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { BookDetailsModal } from "@/components/resources/book-details-modal";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import type { UtmSettings } from "@/lib/tracked-link";
import { getBlurDataUrl, urlForImage } from "@/sanity/lib/image";
import type { BIBLIOGRAPHY_QUERY_RESULT } from "@/sanity/types";

type BibliographyItem = BIBLIOGRAPHY_QUERY_RESULT[number];

function getAuthors(authors: BibliographyItem["authors"]) {
  if (!authors || authors.length === 0) {
    return "-";
  }
  return authors.map((author) => author.name).join(", ");
}

interface BookCardListProps {
  book: BibliographyItem;
  onSelect: (book: BibliographyItem) => void;
}

function BookListItem({ book, onSelect }: BookCardListProps) {
  const coverUrl = urlForImage(book.cover)?.width(96).height(144).url();
  const blurDataURL = getBlurDataUrl(book.cover);
  const handleClick = useCallback(() => {
    onSelect(book);
  }, [book, onSelect]);

  return (
    <ResourceListItem className="max-md:grid-cols-1 max-md:gap-1">
      <span className="col-span-4 max-md:col-span-1">
        <button
          className="inline-flex items-center gap-2 text-left transition-colors hover:text-muted-foreground"
          onClick={handleClick}
          type="button"
        >
          <span className="relative h-10 w-7 shrink-0 overflow-hidden bg-muted">
            {coverUrl ? (
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="28px"
                src={coverUrl}
                {...(blurDataURL
                  ? { blurDataURL, placeholder: "blur" as const }
                  : {})}
              />
            ) : null}
          </span>
          <span>{book.name}</span>
        </button>
      </span>
      <span className="col-span-2 max-md:col-span-1 max-md:pl-6 max-md:text-muted-foreground max-md:text-sm">
        {getAuthors(book.authors)}
      </span>
      <span className="col-span-2 max-md:hidden">
        {book.publisher?.name || "-"}
      </span>
      <span className="col-span-2 max-md:hidden">
        <TagsDisplay tags={book.tags} />
      </span>
      <span className="col-span-2 max-md:hidden">{book.year || "-"}</span>
    </ResourceListItem>
  );
}

interface BibliographyListProps {
  books: BIBLIOGRAPHY_QUERY_RESULT;
  utmSettings?: UtmSettings;
}

export function BibliographyList({
  books,
  utmSettings,
}: BibliographyListProps) {
  const [selectedBook, setSelectedBook] = useState<BibliographyItem | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleBookClick = useCallback((book: BibliographyItem) => {
    setSelectedBook(book);
    setModalOpen(true);
  }, []);

  if (books.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No books available yet.
      </p>
    );
  }

  return (
    <>
      <div>
        {books.map((book) => (
          <BookListItem book={book} key={book._id} onSelect={handleBookClick} />
        ))}
      </div>

      <BookDetailsModal
        book={selectedBook}
        onOpenChange={setModalOpen}
        open={modalOpen}
        utmSettings={utmSettings}
      />
    </>
  );
}
