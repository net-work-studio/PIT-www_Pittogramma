import SearchInput from "@/components/feat/search-input";
import PageHeader from "@/components/page-header";

export default function Page() {
  return (
    <>
      <PageHeader
        subtitle="The complete list of young graphic designers who have a project published on the platform"
        title="Designers"
      />
      <SearchInput />
      <div>as</div>
    </>
  );
}
