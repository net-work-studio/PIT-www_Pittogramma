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
      <BibliographyList books={books} utmSettings={utmSettings} />
    </section>
  );
}
