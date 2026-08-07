import { BibliographyList } from "@/components/resources/bibliography-list";
import type { UtmSettings } from "@/lib/tracked-link";
import type { BIBLIOGRAPHY_QUERY_RESULT } from "@/sanity/types";

interface BibliographyContentProps {
  books: BIBLIOGRAPHY_QUERY_RESULT;
  utmSettings?: UtmSettings;
}

export function BibliographyContent({
  books,
  utmSettings,
}: BibliographyContentProps) {
  return (
    <section className="w-full">
      <div className="sticky top-0 z-10 bg-background pt-16">
        <div className="pb-2.5" />
        <div className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase max-md:hidden">
          <span className="col-span-4">Title</span>
          <span className="col-span-2">Author/s</span>
          <span className="col-span-2">Publisher</span>
          <span className="col-span-2">Tag</span>
          <span className="col-span-2">Year</span>
        </div>
      </div>
      <BibliographyList books={books} utmSettings={utmSettings} />
    </section>
  );
}
