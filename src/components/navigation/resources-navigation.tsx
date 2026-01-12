import Link from "next/link";
import { Button } from "@/components/ui/button";

const resources = [
  {
    label: "Bibliography",
    href: "/bibliography",
  },
  {
    label: "Bookshops",
    href: "/bookshops",
  },
  {
    label: "Glossary",
    href: "/glossary",
  },
  {
    label: "Institutes",
    href: "/institutes",
  },
  {
    label: "Studios & Agencies",
    href: "/studios-agencies",
  },
  {
    label: "Type Foundries",
    href: "/type-foundries",
  },
  {
    label: "Websites",
    href: "/websites",
  },
];

export default function ResourcesNavigation() {
  return (
    <nav className="flex items-center justify-center">
      <ul className="flex flex-row gap-2">
        {resources.map((res) => (
          <li key={res.href}>
            <Button asChild variant="ghost">
              <Link href={res.href}>{res.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
