import SearchInput from "@/components/feat/search-input";
import SubmitProjectBanner from "@/components/feat/submit/submit-project-banner";
import PageHeader from "@/components/shared/page-header";

function StudioCard() {
  return (
    <ul className="grid grid-cols-12 gap-2.5 rounded-lg bg-secondary p-2.5">
      <li className="col-span-6">Name</li>
      <li className="col-span-2">City</li>
      <li className="col-span-2">Country</li>
      <li className="col-span-2">Year</li>
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="The complete list of young graphic designers who have a project published on the platform"
          title="Designers"
        />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-6">Name</li>
          <li className="col-span-2">City</li>
          <li className="col-span-2">Country</li>
          <li className="col-span-2">Year</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {Array.from({ length: 20 }).map((_, index) => (
            <StudioCard key={index} />
          ))}
        </section>
        <SubmitProjectBanner />
      </div>
    </>
  );
}
