"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookDetailsModal } from "@/components/resources/book-details-modal";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import {
  useResourceTarget,
  useScrollToResourceTarget,
} from "@/components/resources/resource-target";
import { TagsDisplay } from "@/components/resources/tags-display";
import { getResourceTargetElementId } from "@/lib/resource-target";
import type { UtmSettings } from "@/lib/tracked-link";
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
  const handleClick = useCallback(() => {
    onSelect(book);
  }, [book, onSelect]);

  return (
    <ResourceListItem
      className="max-md:grid-cols-1 max-md:gap-1"
      id={getResourceTargetElementId(book._id)}
    >
      <span className="col-span-4 max-md:col-span-1">
        <button
          className="text-left transition-colors hover:text-muted-foreground"
          onClick={handleClick}
          type="button"
        >
          {book.name}
        </button>
      </span>
      <span className="col-span-2 max-md:col-span-1 max-md:text-muted-foreground max-md:text-sm">
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
  const resourceIds = useMemo(() => books.map((book) => book._id), [books]);
  const targetResourceId = useResourceTarget(resourceIds);

  useScrollToResourceTarget(targetResourceId);

  useEffect(() => {
    if (!targetResourceId) {
      return;
    }

    const targetBook = books.find((book) => book._id === targetResourceId);
    if (targetBook) {
      setSelectedBook(targetBook);
      setModalOpen(true);
    }
  }, [books, targetResourceId]);

  const handleBookClick = useCallback((book: BibliographyItem) => {
    setSelectedBook(book);
    setModalOpen(true);
  }, []);

  return (
    <>
      {books.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No books available yet.
        </p>
      ) : (
        <>
          <div>
            {books.map((book) => (
              <BookListItem
                book={book}
                key={book._id}
                onSelect={handleBookClick}
              />
            ))}
          </div>

          <BookDetailsModal
            book={selectedBook}
            onOpenChange={setModalOpen}
            open={modalOpen}
            utmSettings={utmSettings}
          />
        </>
      )}
    </>
  );
}
