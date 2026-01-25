import CtaCard from "@/components/cards/cta-card";
import NewsletterCard from "@/components/cards/newsletter-card";
import Calendar from "@/components/feat/calendar";

const CALENDAR_EVENTS = [
  {
    id: "1",
    title: "Design Workshop",
    date: "2025-01-15",
  },
  {
    id: "2",
    title: "Typography Talk",
    date: "2025-01-22",
  },
  {
    id: "3",
    title: "Portfolio Review",
    date: "2025-01-29",
  },
];

export default function HomeAside() {
  return (
    <aside className="col-span-1 space-y-2.5 md:col-span-1">
      <CtaCard
        buttonText={"Call to action"}
        description={"Description text"}
        title={"SECTION TITLE"}
      />
      <Calendar events={CALENDAR_EVENTS} />
      <NewsletterCard />
      <CtaCard
        buttonText={"Call to action"}
        description={"Description text"}
        title={"SECTION TITLE"}
      />
      <CtaCard
        buttonText={"Call to action"}
        description={"Description text"}
        title={"SECTION TITLE"}
      />
    </aside>
  );
}
