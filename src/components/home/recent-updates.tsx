import Link from "next/link";

import type { RECENT_UPDATES_QUERY_RESULT } from "@/sanity/types";

type RecentUpdate = RECENT_UPDATES_QUERY_RESULT[number];

const TYPE_META: Record<string, { label: string; route: string }> = {
  person: { label: "Designer", route: "/designers" },
  studio: { label: "Studios & Agencies", route: "/studios-agencies" },
  typeFoundry: { label: "Type Foundries", route: "/type-foundries" },
  glossary: { label: "Glossary", route: "/glossary" },
  bibliography: { label: "Bibliography", route: "/bibliography" },
  bookshop: { label: "Bookshop", route: "/bookshops" },
  institute: { label: "Institute", route: "/institutes" },
  webSource: { label: "Web Sources", route: "/websites" },
};

interface RecentUpdatesProps {
  items: RecentUpdate[];
}

export default function RecentUpdates({ items }: RecentUpdatesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-lg bg-black px-5 py-6 sm:px-6 sm:py-8">
      <h2 className="font-mono text-muted text-sm uppercase">Recent Updates</h2>

      <ul className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const meta = TYPE_META[item._type] ?? {
            label: item._type,
            route: "/",
          };

          return (
            <li
              className={index < 8 ? "" : "hidden lg:list-item"}
              key={item._id}
            >
              <Link
                className="group flex flex-col gap-1 border-background border-t pt-2 pb-4"
                href={meta.route}
              >
                <span className="font-sans text-background text-base group-hover:text-background/80">
                  {item.name}
                </span>
                <span className="flex items-center gap-1 font-mono text-background text-xs uppercase">
                  <span aria-hidden="true">↗</span>
                  {meta.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
