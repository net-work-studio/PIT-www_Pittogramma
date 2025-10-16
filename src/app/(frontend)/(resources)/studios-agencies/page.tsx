import SearchInput from "@/components/feat/search-input";
import PageHeader from "@/components/page-header";
import ResourcesNavigation from "@/components/resources-navigation";

function StudioCard() {
  return (
    <ul className="grid grid-cols-12 gap-2.5 rounded-xl bg-secondary p-2.5">
      <li className="col-span-4">Name</li>
      <li className="col-span-2">Typology</li>
      <li className="col-span-2">Tag</li>
      <li className="col-span-2">City</li>
      <li className="col-span-2">County</li>
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A mapping of the creative realities around the world"
          title="Studios & Agencies"
        />
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-4">Name</li>
          <li className="col-span-2">Typology</li>
          <li className="col-span-2">Tag</li>
          <li className="col-span-2">City</li>
          <li className="col-span-2">County</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {Array.from({ length: 20 }).map((_, index) => (
            <StudioCard key={index} />
          ))}
        </section>
      </div>
    </>
  );
}
