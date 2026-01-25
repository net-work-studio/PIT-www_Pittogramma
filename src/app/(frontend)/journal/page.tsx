import BaseCard from "@/components/cards/base-card";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

const journalItems = [
  {
    id: "1",
    title: "The Evolution of Swiss Typography",
    authors: [{ name: "Marco Rossi" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/swiss-typography",
  },
  {
    id: "2",
    title: "Designing for Accessibility in 2025",
    authors: [{ name: "Elena Bianchi" }, { name: "Luca Conti" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/accessibility-design",
  },
  {
    id: "3",
    title: "The Return of Print Media",
    authors: [{ name: "Giulia Ferraro" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/print-media-return",
  },
  {
    id: "4",
    title: "Color Theory in Digital Interfaces",
    authors: [{ name: "Andrea Moretti" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/color-theory-digital",
  },
  {
    id: "5",
    title: "Interview: The Future of Brand Identity",
    authors: [{ name: "Sofia Romano" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/future-brand-identity",
  },
  {
    id: "6",
    title: "Minimalism in Contemporary Design",
    authors: [{ name: "Francesco Greco" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/minimalism-contemporary",
  },
  {
    id: "7",
    title: "The Art of Editorial Design",
    authors: [{ name: "Chiara Ricci" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/editorial-design-art",
  },
  {
    id: "8",
    title: "Motion Design Principles",
    authors: [{ name: "Alessandro Bruno" }],
    image: "https://placehold.co/400x300/png",
    href: "/journal/motion-design-principles",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        subtitle="Insights, essays and reflections on graphic design, visual culture and creative practice"
        title="Journal"
      />
      <div className="space-y-10 pb-10">
        <div>
          <Button className="font-mono uppercase">Filters</Button>
        </div>

        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {journalItems.map((item) => (
              <BaseCard
                authors={item.authors}
                href={item.href}
                image={item.image}
                key={item.id}
                title={item.title}
                variant="article"
              />
            ))}
          </div>
        </section>

        <div className="flex items-center justify-center gap-2">
          <Button className="rounded-full font-mono uppercase">1</Button>
          <Button className="rounded-full font-mono uppercase">2</Button>
          <Button className="rounded-full font-mono uppercase">3</Button>
        </div>
      </div>
    </>
  );
}
