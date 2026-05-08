import Link from "next/link";
import Mark from "@/components/brand/mark";
import SubmitDialog from "@/components/feat/submit/submit-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { getEnabledResources, isHeaderSearchEnabled } from "@/lib/feature-flags";
import { NavigationDesktop } from "../navigation/navigation-desktop";
import { NavigationMobile } from "../navigation/navigation-mobile";
import { Search } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  const enabledResources = getEnabledResources();
  const headerSearchEnabled = isHeaderSearchEnabled();

  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex w-full flex-row items-center justify-between border-foreground/5 border-b-[0.5px] bg-background px-4 py-2.5">
      <Link href="/" className="flex items-center">
        <span className="sr-only">Pittogramma — Home</span>
        <Mark aria-hidden="true" focusable="false" />
      </Link>
      <NavigationDesktop resources={enabledResources} />
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex">
          <SubmitDialog />
        </div>
        {headerSearchEnabled && (
          <div className="hidden md:flex">
            <Button size="icon" variant="outline">
              <Search size={16} />
            </Button>
          </div>
        )}
        <div className="hidden lg:flex">
          <ModeToggle />
        </div>
        <NavigationMobile resources={enabledResources} />
      </div>
    </header>
  );
}
