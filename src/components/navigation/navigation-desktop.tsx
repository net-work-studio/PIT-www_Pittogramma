"use client";

import Link from "next/link";
import type * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationDesktop() {
  return (
    <NavigationMenu
      className="absolute right-1/2 left-1/2 -translate-x-1/2"
      viewport={false}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-content">
              <ListItem href="/projects" title="Projects" />
              <ListItem href="/interviews" title="Interviews" />
              <ListItem href="/designers" title="Designers" />
              <ListItem href="/billboard" title="Billboard" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[270px]">
              <ListItem href="/studios-agencies" title="Studios & Agencies" />
              <ListItem href="/type-foundries" title="Type Foundries" />
              <ListItem href="/institutes" title="Institutes" />
              <ListItem href="/bookshops" title="Bookshops" />
              <ListItem href="/glossary" title="Glossary" />
              <ListItem href="/bibliography" title="Bibliography" />
              <ListItem href="/websites" title="Websites" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/journal">Journal</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/events">Events</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Info</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-content">
              <ListItem href="/about" title="About" />
              <ListItem href="/editions" title="Editions" />
              <ListItem href="/studio" title="Studio" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-3xl leading-none">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
