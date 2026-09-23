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
import type { Resource } from "./resources-navigation.data";

export function NavigationDesktop({ resources }: { resources: Resource[] }) {
  return (
    <NavigationMenu className="absolute right-1/2 left-1/2 hidden -translate-x-1/2 lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-content">
              <ListItem href="/projects" title="Projects" />
              <ListItem href="/interviews" title="Interviews" />
              <ListItem href="/designers" title="Designers" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Index</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-100">
              {resources.map((res) => (
                <ListItem href={res.href} key={res.href} title={res.label} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            closeOnClick
            render={<Link href="/journal" />}
          >
            Journal
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            closeOnClick
            render={<Link href="/events" />}
          >
            Events
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            closeOnClick
            render={<Link href="/about" />}
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  href,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"li">, "children"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink closeOnClick render={<Link href={href} />}>
        <div className="whitespace-break-spaces text-3xl leading-none hover:text-muted-foreground">
          {title}
        </div>
      </NavigationMenuLink>
    </li>
  );
}
