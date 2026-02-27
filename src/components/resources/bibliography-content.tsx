"use client";

import { useState } from "react";

import { BibliographyList } from "@/components/resources/bibliography-list";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [view, setView] = useState("list");

  return (
    <Tabs className="w-full gap-0" defaultValue="list" onValueChange={setView}>
      <div className="sticky top-0 z-10 bg-background pt-16 pb-2.5">
        <div className="flex w-full items-center justify-between pb-2.5">
          <Input placeholder="Search" type="search" />
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>
        </div>
        {view === "list" && (
          <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
            <li className="col-span-3">Title</li>
            <li className="col-span-1">Language</li>
            <li className="col-span-3">Author/s</li>
            <li className="col-span-2">Publisher</li>
            <li className="col-span-2">Tag</li>
            <li className="col-span-1">Year</li>
          </ul>
        )}
      </div>

      <TabsContent className="w-full" value="list">
        <BibliographyList books={books} utmSettings={utmSettings} view="list" />
      </TabsContent>
      <TabsContent className="w-full" value="grid">
        <BibliographyList books={books} utmSettings={utmSettings} view="grid" />
      </TabsContent>
    </Tabs>
  );
}
