import BaseCard from "@/components/cards/base-card";
import type { sampleHomeData } from "@/sample-data/sample-home-data";

export default function HomeGrid({ data }: { data: typeof sampleHomeData }) {
  return (
    <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
      {data.map((card) => (
        <BaseCard
          authors={card.authors}
          big={card.big}
          href={card.href}
          image={card.image}
          key={card.id}
          title={card.title}
          variant={card.variant}
        />
      ))}
    </section>
  );
}
