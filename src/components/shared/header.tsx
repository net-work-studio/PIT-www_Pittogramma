import Link from "next/link";
import Mark from "@/components/brand/mark";
import NavigationDropdown from "@/components/design-system/navigation-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

import SubmitDialog from "../feat/submit/submit-dialog";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex w-full flex-row items-center justify-between bg-background px-4 py-2.5">
      <Link href="/">
        <Mark />
      </Link>
      <menu className="flex items-center gap-2.5">
        <NavigationDropdown
          links={[
            { href: "/projects", label: "Projects" },
            { href: "/interviews", label: "Interviews" },
            { href: "/designers", label: "Designers" },
            { href: "/billboard", label: "Billboard" },
          ]}
          title="Features"
        />
        <NavigationDropdown
          links={[
            { href: "/studios-agencies", label: "Studios & Agencies" },
            { href: "/type-foundries", label: "Type Foundries" },
            { href: "/institutes", label: "Institutes" },
            { href: "/bookshops", label: "Bookshops" },
            { href: "/glossary", label: "Glossary" },
            { href: "/bibliography", label: "Bibliography" },
            { href: "/websites", label: "Websites" },
          ]}
          title="Resources"
        />
        <Button asChild variant={"ghost"}>
          <Link href="/journal">Journal</Link>
        </Button>
        <Button asChild variant={"ghost"}>
          <Link href="/events">Events</Link>
        </Button>
        <NavigationDropdown
          links={[
            { href: "/about", label: "About" },
            { href: "/editions", label: "Editions" },
            { href: "/studio", label: "Studio" },
          ]}
          title="Info"
        />
      </menu>
      <div className="flex gap-2.5">
        <SubmitDialog />
        <ModeToggle />
      </div>
    </header>
  );
}
