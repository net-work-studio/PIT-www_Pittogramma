import SearchInput from "@/components/feat/search-input";
import PageHeader from "@/components/shared/page-header";
import ResourcesNavigation from "@/components/navigation/resources-navigation";

function BookshopCard() {
  return (
    <ul className="grid grid-cols-12 gap-2.5 rounded-lg bg-secondary p-2.5">
      <li className="col-span-6">Bookshop Name</li>
      <li className="col-span-3">City</li>
      <li className="col-span-3">Country</li>
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of independent bookshops around the world"
          title="Bookshops"
        />
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-6">Name</li>
          <li className="col-span-3">City</li>
          <li className="col-span-3">Country</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {Array.from({ length: 20 }).map((_, index) => (
            <BookshopCard key={index} />
          ))}
        </section>
      </div>
    </>
  );
}
