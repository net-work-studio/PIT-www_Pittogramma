"use client";

import Image from "next/image";
import { MultilineText } from "@/components/shared/multiline-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";
import { getBlurDataUrl, urlForImage } from "@/sanity/lib/image";
import type { BIBLIOGRAPHY_QUERY_RESULT } from "@/sanity/types";

type BookItem = BIBLIOGRAPHY_QUERY_RESULT[number];

interface BookDetailsModalProps {
  book: BookItem | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  utmSettings?: UtmSettings;
}

function joinNames(items: Array<{ name: string }> | null | undefined) {
  if (!items) {
    return null;
  }
  return items.map((item) => item.name).join(", ") || null;
}

export function BookDetailsModal({
  book,
  open,
  onOpenChange,
  utmSettings,
}: BookDetailsModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!book) {
    return null;
  }

  const content = <BookDetailsContent book={book} utmSettings={utmSettings} />;
  const title = book.name || "Book";

  if (isDesktop) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="max-h-[85vh] overflow-y-auto p-6" side="bottom">
        <SheetTitle className="sr-only">{title}</SheetTitle>
        {content}
      </SheetContent>
    </Sheet>
  );
}

function BookDetailsContent({
  book,
  utmSettings,
}: {
  book: BookItem;
  utmSettings?: UtmSettings;
}) {
  const coverUrl = urlForImage(book.cover)?.width(800).height(1200).url();
  const blurDataURL = getBlurDataUrl(book.cover);
  const authors = joinNames(book.authors);
  const languages = joinNames(book.languages);

  return (
    <div className="flex w-full flex-col md:flex-row md:items-stretch">
      <div className="aspect-2/3 w-full md:relative md:aspect-auto md:w-2/5 md:shrink-0">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted md:absolute md:inset-0 md:rounded-none md:rounded-l-xl">
          {coverUrl ? (
            <Image
              alt={book.cover?.alt || book.name || "Book cover"}
              className="object-cover"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              src={coverUrl}
              {...(blurDataURL
                ? { blurDataURL, placeholder: "blur" as const }
                : {})}
            />
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col gap-5 p-5 max-md:px-0 max-md:pb-0 md:w-3/5">
        <header>
          <h2 className="text-lg">{book.name}</h2>
          {authors ? <p className="text-muted-foreground">{authors}</p> : null}
        </header>

        {book.description ? (
          <p>
            <MultilineText text={book.description} />
          </p>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
          <BookDetail label="Publisher" value={book.publisher?.name} />
          <BookDetail label="Year" value={book.year} />
          <BookDetail label="Language" value={languages} />
          <BookDetail label="Pages" value={book.pageCount} />
          <BookDetail className="col-span-2" label="ISBN" value={book.isbn} />
        </dl>

        {book.categories?.length ? (
          <section className="flex flex-col gap-2">
            <p className="font-mono text-muted-foreground text-xxs uppercase">
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {book.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        {book.affiliateLink ? (
          <Button
            className="mt-auto w-fit"
            nativeButton={false}
            render={
              <a
                href={buildTrackedLink(book.affiliateLink, "book", utmSettings)}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
          >
            Buy book
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function BookDetail({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: number | string | null | undefined;
}) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className={className}>
      <dt className="font-mono text-muted-foreground text-xxs uppercase">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
