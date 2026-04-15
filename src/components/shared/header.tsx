import Link from "next/link";
import Mark from "@/components/brand/mark";
import SubmitDialog from "@/components/feat/submit/submit-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { getEnabledResources } from "@/lib/feature-flags";
import { NavigationDesktop } from "../navigation/navigation-desktop";
import { NavigationMobile } from "../navigation/navigation-mobile";

export default function Header() {
  const enabledResources = getEnabledResources();

  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex w-full flex-row items-center justify-between border-foreground/5 border-b-[0.5px] bg-background px-4 py-2.5">
      <Link href="/">
        <Mark />
      </Link>
      <NavigationDesktop resources={enabledResources} />
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex">
          <SubmitDialog />
        </div>
        <div className="hidden lg:flex">
          <ModeToggle />
        </div>
        <NavigationMobile resources={enabledResources} />
      </div>
    </header>
  );
}
