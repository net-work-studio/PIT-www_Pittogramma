"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Resource } from "./resources-navigation.data";

export default function ResourcesNavigation({
  resources,
}: {
  resources: Resource[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center">
      <ul className="flex flex-row gap-2">
        {resources.map((res) => {
          const isActive =
            pathname === res.href || pathname.startsWith(`${res.href}/`);
          return (
            <li key={res.href}>
              <Button
                data-active={isActive}
                nativeButton={false}
                render={<Link href={res.href} />}
                variant="ghost"
              >
                {res.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
