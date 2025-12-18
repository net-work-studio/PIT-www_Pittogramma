import SearchInput from "../feat/search-input";
import ResourcesNavigation from "../navigation/resources-navigation";
import PageHeader from "../shared/page-header";

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
