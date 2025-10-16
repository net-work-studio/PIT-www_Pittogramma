import SearchInput from "./feat/search-input";
import PageHeader from "./page-header";
import ResourcesNavigation from "./resources-navigation";

export default function ResourcesHeader() {
  return (
    <>
      <PageHeader
        className="pb-0"
        subtitle="The most interesting and visionary projects designed by talented young graphic designers around the world who highlights new styles and trends"
        title="Projects"
      />
      <ResourcesNavigation />
      <SearchInput />
    </>
  );
}
