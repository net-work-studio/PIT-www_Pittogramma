"use client";

import { useState } from "react";
import { BibliographyList } from "@/components/resources/bibliography-list";
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
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <section className="flex flex-col gap-1.5">
      <Tabs
        className="w-full"
        defaultValue="list"
        onValueChange={(value) => setView(value as "list" | "grid")}
      >
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="grid">Grid</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="list">
          <BibliographyList
            books={books}
            utmSettings={utmSettings}
            view="list"
          />
        </TabsContent>
        <TabsContent className="w-full" value="grid">
          <BibliographyList
            books={books}
            utmSettings={utmSettings}
            view="grid"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
