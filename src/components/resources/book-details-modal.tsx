"use client";

import Image from "next/image";
import { MultilineText } from "@/components/shared/multiline-text";
import { ScrollFade } from "@/components/shared/scroll-fade";
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
        <DialogContent className="sm:!max-w-7xl h-[min(85vh,calc(53.333vw-1.06667rem),42.6667rem)] w-full max-w-7xl overflow-hidden p-0 px-4">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="flex h-[85vh] max-h-[85vh] flex-col overflow-hidden p-6"
        side="bottom"
      >
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
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="aspect-3/4 w-full shrink-0 md:relative md:h-full md:w-auto">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted p-5 md:absolute md:inset-0 md:rounded-none md:rounded-l-xl md:p-6">
          {coverUrl ? (
            <Image
              alt={book.cover?.alt || book.name || "Book cover"}
              className="object-contain"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              src={coverUrl}
              style={{ objectFit: "contain" }}
              {...(blurDataURL
                ? { blurDataURL, placeholder: "blur" as const }
                : {})}
            />
          ) : null}
        </div>
      </div>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <header className="shrink-0 px-5 pt-5 pb-2.5 max-md:px-0">
          <h2 className="text-lg">{book.name}</h2>
          {authors ? <p className="text-muted-foreground">{authors}</p> : null}
        </header>

        <ScrollFade className="min-h-0 flex-1" key={book._id}>
          <div className="flex flex-col gap-5 px-5 pt-5 pb-24 max-md:px-0">
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
              <BookDetail
                className="col-span-2"
                label="ISBN"
                value={book.isbn}
              />
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
                    href={buildTrackedLink(
                      book.affiliateLink,
                      "book",
                      utmSettings
                    )}
                    rel="noopener noreferrer"
                    target="_blank"
                  />
                }
              >
                Buy book
              </Button>
            ) : null}
          </div>
        </ScrollFade>
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
