import HomeGrid from "@/components/home-grid";
import PageHeader from "@/components/shared/page-header";

export default function Home() {
  return (
    <>
      <PageHeader
        subtitle="Digital platform for sharing projects designed by young designers,resources, events and experiences from the world graphic design scene"
        title="Pittogramma"
      />

      <HomeGrid />
    </>
  );
}
