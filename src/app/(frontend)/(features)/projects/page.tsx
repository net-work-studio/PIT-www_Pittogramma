import BaseCard from "@/components/cards/base-card";
import SubmitBanner from "@/components/feat/submit/submit-banner";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

const cards = [
  {
    id: "1",
    title: "Typography Masterclass",
    authors: [{ name: "Sarah Chen" }, { name: "Alex Rivera" }],
    image: "https://placehold.co/400x300/png",
  },
  {
    id: "2",
    title: "Design Trends 2025",
    authors: [{ name: "Maria Garcia" }],
    image: "https://placehold.co/400x300/png",
  },
  {
    id: "3",
    title: "Interview with Creative Director",
    authors: [{ name: "John Smith" }],
    image: "https://placehold.co/400x300/png",
  },
  {
    id: "4",
    title: "Featured Designer Spotlight",
    authors: [{ name: "Emma Wilson" }],
    image: "https://placehold.co/400x300/png",
  },
  {
    id: "5",
    title: "Design Conference 2025",
    authors: [{ name: "Conference Team" }],
    image: "https://placehold.co/400x300/png",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        subtitle="The most interesting and visionary projects designed by talented young graphic designers around the world who highlights new styles and trends"
        title="Projects"
      />
      <div>
        <div>
          <Button className="font-mono uppercase">Filters</Button>
        </div>
        <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
          {cards.map((card) => (
            <BaseCard
              authors={card.authors}
              image={card.image}
              key={card.id}
              title={card.title}
            />
          ))}
        </section>
      </div>
      <SubmitBanner />
    </>
  );
}
