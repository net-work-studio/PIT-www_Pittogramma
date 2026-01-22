"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BibliographyList } from "@/components/resources/bibliography-list";
import type { BIBLIOGRAPHY_QUERY_RESULT } from "@/sanity/types";

interface BibliographyContentProps {
  books: BIBLIOGRAPHY_QUERY_RESULT;
}

export function BibliographyContent({ books }: BibliographyContentProps) {
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
          <BibliographyList books={books} view="list" />
        </TabsContent>
        <TabsContent className="w-full" value="grid">
          <BibliographyList books={books} view="grid" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
