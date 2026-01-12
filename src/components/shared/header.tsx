import Link from "next/link";
import Mark from "@/components/brand/mark";
import SubmitDialog from "@/components/feat/submit/submit-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationDesktop } from "../navigation/navigation-desktop";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 flex w-full flex-row items-center justify-between border-foreground/20 border-b-[0.5px] bg-background px-4 py-2.5">
      <Link href="/">
        <Mark />
      </Link>
      <NavigationDesktop />
      <div className="flex gap-2.5">
        <SubmitDialog />
        <ModeToggle />
      </div>
    </header>
  );
}
