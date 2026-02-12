import { notFound } from "next/navigation";

import ColorsSection from "./_components/colors-section";
import ModulesSection from "./_components/modules-section";
import TypographySection from "./_components/typography-section";
import UiSection from "./_components/ui-section";

const NAV_ITEMS = [
  { href: "#colors", label: "Colors" },
  { href: "#typography", label: "Typography" },
  { href: "#ui-components", label: "UI Components" },
  { href: "#modules", label: "Modules" },
];

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-12 py-16">
      <nav className="sticky top-20 hidden h-fit w-40 shrink-0 lg:block">
        <p className="mb-4 font-mono text-muted-foreground text-xs uppercase">
          Design System
        </p>
        <ul className="space-y-2 border-border border-l pl-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                className="font-mono text-muted-foreground text-sm transition-colors hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1 space-y-32">
        <ColorsSection />
        <TypographySection />
        <UiSection />
        <ModulesSection />
      </div>
    </div>
  );
}
