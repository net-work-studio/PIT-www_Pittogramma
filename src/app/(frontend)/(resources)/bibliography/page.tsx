import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import PageHeader from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function BookCardList() {
  return (
    <ul className="grid grid-cols-12 gap-2.5 rounded-lg bg-secondary p-2.5">
      <li className="col-span-3">Title</li>
      <li className="col-span-1">Language</li>
      <li className="col-span-3">Author/s</li>
      <li className="col-span-2">Publisher</li>
      <li className="col-span-2">Tag</li>
      <li className="col-span-1">Year</li>
    </ul>
  );
}

function BookCardGrid() {
  return (
    <ul className="col-span-2 grid gap-2.5 rounded-lg bg-secondary p-2.5">
      <li className="col-span-3">Title</li>
      <li className="col-span-1">Language</li>
      <li className="col-span-3">Author/s</li>
      <li className="col-span-2">Publisher</li>
      <li className="col-span-2">Tag</li>
      <li className="col-span-1">Year</li>
    </ul>
  );
}

export default function Page() {
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
              {Array.from({ length: 20 }).map((_, index) => (
                <BookCardList key={index} />
              ))}
            </TabsContent>
            <TabsContent
              className="grid w-full grid-cols-6 gap-1.5"
              value="grid"
            >
              {Array.from({ length: 20 }).map((_, index) => (
                <BookCardGrid key={index} />
              ))}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}
