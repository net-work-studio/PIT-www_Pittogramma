"use client";

import { useState } from "react";
import { LanguagesDisplay } from "@/components/resources/languages-display";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import { BookDetailsDrawer } from "@/components/resources/book-details-drawer";
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
  onClick: () => void;
}

function BookCardList({ book, onClick }: BookCardListProps) {
  return (
    <ResourceListItem className="cursor-pointer transition-colors hover:bg-secondary/80">
      <li className="col-span-3">
        <button
          type="button"
          onClick={onClick}
          className="text-left underline hover:no-underline"
        >
          {book.name}
        </button>
      </li>
      <li className="col-span-1">
        <LanguagesDisplay languages={book.languages} />
      </li>
      <li className="col-span-3">{getAuthors(book.authors)}</li>
      <li className="col-span-2">{book.publisher?.name || "-"}</li>
      <li className="col-span-2">
        <TagsDisplay tags={book.tagSelector?.tags} />
      </li>
      <li className="col-span-1">{book.year || "-"}</li>
    </ResourceListItem>
  );
}

interface BookCardGridProps {
  book: BibliographyItem;
  onClick: () => void;
}

function BookCardGrid({ book, onClick }: BookCardGridProps) {
  return (
    <ul
      className="col-span-2 grid cursor-pointer gap-2.5 rounded-lg bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <li className="font-medium">{book.name}</li>
      <li className="text-muted-foreground text-sm">
        {getAuthors(book.authors)}
      </li>
      <li className="text-muted-foreground text-sm">
        {book.publisher?.name || "-"}
      </li>
      <li className="text-sm">{book.year || "-"}</li>
    </ul>
  );
}

interface BibliographyListProps {
  books: BIBLIOGRAPHY_QUERY_RESULT;
  view: "list" | "grid";
  utmSettings?: UtmSettings;
}

export function BibliographyList({ books, view, utmSettings }: BibliographyListProps) {
  const [selectedBook, setSelectedBook] = useState<BibliographyItem | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleBookClick = (book: BibliographyItem) => {
    setSelectedBook(book);
    setDrawerOpen(true);
  };

  if (books.length === 0) {
    return (
      <p
        className={
          view === "grid"
            ? "col-span-6 text-center text-muted-foreground"
            : "text-center text-muted-foreground"
        }
      >
        No books available yet.
      </p>
    );
  }

  return (
    <>
      {view === "list" ? (
        <div className="space-y-1.5">
          {books.map((book) => (
            <BookCardList
              book={book}
              key={book._id}
              onClick={() => handleBookClick(book)}
            />
          ))}
        </div>
      ) : (
        <div className="grid w-full grid-cols-6 gap-1.5">
          {books.map((book) => (
            <BookCardGrid
              book={book}
              key={book._id}
              onClick={() => handleBookClick(book)}
            />
          ))}
        </div>
      )}

      <BookDetailsDrawer
        book={selectedBook}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        utmSettings={utmSettings}
      />
    </>
  );
}
