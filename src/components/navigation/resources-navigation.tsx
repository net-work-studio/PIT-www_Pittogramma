"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resources } from "./resources-navigation.data";

export default function ResourcesNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center">
      <ul className="flex flex-row gap-2">
        {resources.map((res) => {
          const isActive =
            pathname === res.href || pathname.startsWith(`${res.href}/`);
          return (
            <li key={res.href}>
              <Button asChild data-active={isActive} variant="ghost">
                <Link href={res.href}>{res.label}</Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
