import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { LanguagesDisplay } from "@/components/resources/languages-display";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import PageHeader from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanityFetch } from "@/sanity/lib/live";
import { BIBLIOGRAPHY_QUERY } from "@/sanity/lib/queries";
import type { BIBLIOGRAPHY_QUERY_RESULT } from "@/sanity/types";

type BibliographyItem = BIBLIOGRAPHY_QUERY_RESULT[number];

function getAuthors(authors: BibliographyItem["authors"]) {
  if (!authors || authors.length === 0) {
    return "-";
  }
  return authors.map((author) => author.name).join(", ");
}

function BookCardList({ book }: { book: BibliographyItem }) {
  return (
    <ResourceListItem>
      <li className="col-span-3">{book.name}</li>
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

function BookCardGrid({ book }: { book: BibliographyItem }) {
  return (
    <ul className="col-span-2 grid gap-2.5 rounded-lg bg-secondary p-2.5">
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
        <section className="flex flex-col gap-1.5">
          <Tabs className="w-full" defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
            <TabsContent className="w-full space-y-1.5" value="list">
              {books.length > 0 ? (
                books.map((book) => <BookCardList book={book} key={book._id} />)
              ) : (
                <p className="text-center text-muted-foreground">
                  No books available yet.
                </p>
              )}
            </TabsContent>
            <TabsContent
              className="grid w-full grid-cols-6 gap-1.5"
              value="grid"
            >
              {books.length > 0 ? (
                books.map((book) => <BookCardGrid book={book} key={book._id} />)
              ) : (
                <p className="col-span-6 text-center text-muted-foreground">
                  No books available yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}
