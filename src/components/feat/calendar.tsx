interface Event {
  category?: "event" | "interview" | "article" | "project";
  cta?: {
    text: string;
    link: string;
  };
  date: string;
  id: string;
  title: string;
}

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <div className="rounded bg-secondary p-2.5">
      <h2 className="font-mono text-[10px] uppercase">Calendar</h2>
      <div>
        <h3 className="border-border border-b pb-3 font-mono text-[10px] uppercase">
          Upcoming
        </h3>
        <ol>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.date}</p>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="border-border border-b pb-3 font-mono text-[10px] uppercase">
          Past
        </h3>
        <ol>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.date}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
