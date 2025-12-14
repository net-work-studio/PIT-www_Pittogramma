import BaseCard from "@/components/cards/base-card";

const cards = [
  {
    id: "1",
    title: "Typography Masterclass",
    authors: [{ name: "Sarah Chen" }, { name: "Alex Rivera" }],
    image: "https://placehold.co/400x300/png",
    variant: "project" as const,
    big: true,
    href: "/",
  },
  {
    id: "2",
    title: "Design Trends 2025",
    authors: [{ name: "Maria Garcia" }],
    image: "https://placehold.co/400x300/png",
    variant: "article" as const,
    href: "/",
  },
  {
    id: "3",
    title: "Interview with Creative Director",
    authors: [{ name: "John Smith" }],
    image: "https://placehold.co/400x300/png",
    variant: "interview" as const,
    href: "/",
  },
  {
    id: "4",
    title: "Featured Designer Spotlight",
    authors: [{ name: "Emma Wilson" }],
    image: "https://placehold.co/400x300/png",
    variant: "feat" as const,
    href: "/",
  },
  {
    id: "5",
    title: "Design Conference 2025",
    authors: [{ name: "Conference Team" }],
    image: "https://placehold.co/400x300/png",
    variant: "event" as const,
    href: "/",
  },
];

export default function HomeGrid() {
  return (
    <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
      {cards.map((card) => (
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
