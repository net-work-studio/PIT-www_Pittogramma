import SearchInput from "@/components/feat/search-input";
import PageHeader from "@/components/page-header";
import ResourcesNavigation from "@/components/resources-navigation";

function InstituteCard() {
  return (
    <ul className="grid grid-cols-12 gap-2.5 rounded-lg bg-secondary p-2.5">
      <li className="col-span-4">Name</li>
      <li className="col-span-2">ITA</li>
      <li className="col-span-2">City</li>
      <li className="col-span-2">Country</li>
      <li className="col-span-2">2000</li>
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the institutes, schools and universities around the world"
          title="Institutes"
        />
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-4">Name</li>
          <li className="col-span-2">Language</li>
          <li className="col-span-2">City</li>
          <li className="col-span-2">Country</li>
          <li className="col-span-2">Foundation</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {Array.from({ length: 20 }).map((_, index) => (
            <InstituteCard key={index} />
          ))}
        </section>
      </div>
    </>
  );
}
