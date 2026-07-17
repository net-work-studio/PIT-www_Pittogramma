"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Mark from "@/components/brand/mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Resource } from "./resources-navigation.data";

interface MenuItemWithChildren {
  children: { href: string; label: string }[];
  label: string;
}

interface MenuItemLink {
  href: string;
  label: string;
}

type MenuItem = MenuItemWithChildren | MenuItemLink;

function hasChildren(item: MenuItem): item is MenuItemWithChildren {
  return "children" in item;
}

export function NavigationMobile({ resources }: { resources: Resource[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        label: "Features",
        children: [
          { href: "/projects", label: "Projects" },
          { href: "/interviews", label: "Interviews" },
          { href: "/designers", label: "Designers" },
        ],
      },
      {
        label: "Resources",
        children: resources.map((r) => ({ href: r.href, label: r.label })),
      },
      { label: "Journal", href: "/journal" },
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
    ],
    [resources]
  );

  const toggleSection = (label: string) => {
    setExpandedSection((prev) => (prev === label ? null : label));
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedSection(null);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <Button
        aria-hidden={isOpen}
        className={cn(
          "lg:hidden",
          isOpen && "border-background text-background"
        )}
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
      >
        Menu
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <Link href="/" onClick={closeMenu}>
              <Mark />
            </Link>
            <Button onClick={closeMenu} size="sm" variant="outline">
              Close
            </Button>
          </div>

          {/* Menu content */}
          <nav className="flex-1 overflow-y-auto px-4 pt-8">
            <div className="flex flex-col gap-3">
              {/* Submit button */}
              <Button
                className="w-fit"
                nativeButton={false}
                onClick={closeMenu}
                render={<Link href="/submit" />}
                variant="outline"
              >
                Submit your project
              </Button>

              {/* Menu items */}
              {menuItems.map((item) =>
                hasChildren(item) ? (
                  <div key={item.label}>
                    <button
                      className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors hover:bg-accent"
                      onClick={() => toggleSection(item.label)}
                      type="button"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-200",
                          expandedSection === item.label && "rotate-180"
                        )}
                      />
                    </button>

                    {expandedSection === item.label && (
                      <div className="mt-3 flex flex-col gap-2 pl-1">
                        {item.children.map((child) => (
                          <Link
                            className="text-2xl leading-tight transition-opacity hover:opacity-70"
                            href={child.href}
                            key={child.href}
                            onClick={closeMenu}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-fit"
                    key={item.label}
                    nativeButton={false}
                    onClick={closeMenu}
                    render={<Link href={item.href} />}
                    variant="outline"
                  >
                    {item.label}
                  </Button>
                )
              )}
            </div>
          </nav>

          {/* Footer */}
          <footer className="px-4 py-4 text-muted-foreground text-xs">
            <p>&copy; 2025 Pittogramma</p>
            <p>All Rights Reserved. Privacy Policy</p>
          </footer>
        </div>
      )}
    </>
  );
}
