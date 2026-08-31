"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  type MouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BookDetailsModal } from "@/components/resources/book-details-modal";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { ResourceMobileCard } from "@/components/resources/resource-mobile-card";
import {
  useResourceTarget,
  useScrollToResourceTarget,
} from "@/components/resources/resource-target";
import { TagsDisplay } from "@/components/resources/tags-display";
import {
  type ResourceListSortState,
  sortResourceListItems,
} from "@/lib/resource-list-sort";
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

const LIST_COLUMNS = [
  {
    className: "col-span-4",
    getSortValue: (book: BibliographyItem) => book.name,
    id: "name",
    label: "Title",
  },
  {
    className: "col-span-3",
    getSortValue: (book: BibliographyItem) => book.authors?.[0]?.name,
    id: "author",
    label: "Author/s",
  },
  {
    className: "col-span-2",
    getSortValue: (book: BibliographyItem) => book.publisher?.name,
    id: "publisher",
    label: "Publisher",
  },
  {
    className: "col-span-2",
    getSortValue: (book: BibliographyItem) => book.tags?.[0]?.name,
    id: "tag",
    label: "Tag",
  },
  {
    className: "col-span-1",
    getSortValue: (book: BibliographyItem) => book.year,
    id: "year",
    label: "Year",
  },
];

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
      id={getResourceTargetElementId(book._id)}
      mobileContent={
        <ResourceMobileCard
          badge={book.tags?.length ? <TagsDisplay tags={book.tags} /> : undefined}
          fields={[
            { label: "Author/s", value: getAuthors(book.authors) },
            { label: "Publisher", value: book.publisher?.name || "-" },
            { label: "Year", value: book.year || "-" },
          ]}
          name={
            <button
              className="cursor-pointer text-left"
              onClick={handleClick}
              type="button"
            >
              {book.name}
            </button>
          }
        />
      }
    >
      <span className="col-span-4">
        <button
          className="text-left transition-colors hover:text-muted-foreground"
          onClick={handleClick}
          type="button"
        >
          {book.name}
        </button>
      </span>
      <span className="col-span-3">
        {getAuthors(book.authors)}
      </span>
      <span className="col-span-2 max-md:hidden">
        {book.publisher?.name || "-"}
      </span>
      <span className="col-span-2 max-md:hidden">
        <TagsDisplay tags={book.tags} />
      </span>
      <span className="col-span-1 max-md:hidden">{book.year || "-"}</span>
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
  return (
    <Suspense fallback={null}>
      <BibliographyListContent books={books} utmSettings={utmSettings} />
    </Suspense>
  );
}

function BibliographyListContent({
  books,
  utmSettings,
}: BibliographyListProps) {
  const [selectedBook, setSelectedBook] = useState<BibliographyItem | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [sort, setSort] = useState<ResourceListSortState | null>(null);
  const resourceIds = useMemo(() => books.map((book) => book._id), [books]);
  const sortedBooks = useMemo(
    () => sortResourceListItems(books, LIST_COLUMNS, sort),
    [books, sort]
  );
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

  const handleSort = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const { dataset } = event.currentTarget;
    const { columnId } = dataset;

    if (!columnId) {
      return;
    }

    setSort((currentSort) => ({
      columnId,
      direction:
        currentSort?.columnId === columnId && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  return (
    <>
      {books.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No books available yet.
        </p>
      ) : (
        <>
              <div className="sticky top-0 z-10 bg-background pt-16 max-md:static max-md:pt-4">
            <div className="pb-2.5" />
            <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-muted-foreground text-xs uppercase max-md:hidden">
              {LIST_COLUMNS.map((column) => {
                const isActive = sort?.columnId === column.id;
                const sortDirection = isActive ? sort?.direction : undefined;
                const SortIcon =
                  sortDirection === "asc" ? ArrowUpIcon : ArrowDownIcon;

                return (
                  <li className={column.className} key={column.id}>
                    <button
                      aria-label={`Sort by ${column.label}${sortDirection ? `, ${sortDirection === "asc" ? "ascending" : "descending"}` : ""}`}
                      aria-pressed={isActive}
                      className="inline-flex w-full cursor-pointer items-center gap-1 text-left uppercase"
                      data-column-id={column.id}
                      onClick={handleSort}
                      type="button"
                    >
                      {column.label}
                      {isActive && (
                        <SortIcon aria-hidden="true" className="size-3" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            {sortedBooks.map((book) => (
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
