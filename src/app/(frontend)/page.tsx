import HomeAside from "@/components/home-aside";
import HomeGrid from "@/components/home-grid";
import PageHeader from "@/components/page-header";

export default function Home() {
  return (
    <>
      <PageHeader
        subtitle="Digital platform for sharing projects designed by young designers,resources, events and experiences from the world graphic design scene"
        title="Pittogramma"
      />
      <article className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4">
        <HomeAside />
        <HomeGrid />
      </article>
    </>
  );
}
