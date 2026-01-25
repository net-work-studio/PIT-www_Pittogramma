import type { Metadata } from "next";

import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import PageHeader from "@/components/shared/page-header";
import { BibliographyContent } from "@/components/resources/bibliography-content";
import { sanityFetch } from "@/sanity/lib/live";
import { BIBLIOGRAPHY_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Bibliography",
  description: "A constantly updated list of books on graphic design",
};

export default async function Page() {
  const { data: books } = await sanityFetch({
    query: BIBLIOGRAPHY_QUERY,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A constantly updated list of books on graphic design"
          title="Resources"
        />
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="sticky top-15 grid grid-cols-12 gap-2.5 border-b bg-background px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-3">Title</li>
          <li className="col-span-1">Language</li>
          <li className="col-span-3">Author/s</li>
          <li className="col-span-2">Publisher</li>
          <li className="col-span-2">Tag</li>
          <li className="col-span-1">Year</li>
        </ul>
        <BibliographyContent books={books} />
      </div>
    </>
  );
}
