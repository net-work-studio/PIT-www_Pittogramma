"use client";

import { type ReactNode, useState } from "react";

import type { ResourceMapMarker } from "@/components/resources/resource-map-view";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/feature-flags";

export interface ResourceListColumn {
  className: string;
  label: string;
}

interface ResourceViewTabsProps<T> {
  emptyMessage: string;
  enabledViews: ViewMode[];
  items: T[];
  listColumns: ResourceListColumn[];
  markers?: ResourceMapMarker[];
  renderGridItem: (item: T) => ReactNode;
  renderListItem: (item: T) => ReactNode;
  searchEnabled: boolean;
}

export function ResourceViewTabs<T>({
  emptyMessage,
  enabledViews,
  items,
  listColumns,
  markers,
  renderGridItem,
  renderListItem,
  searchEnabled,
}: ResourceViewTabsProps<T>) {
  const defaultView = enabledViews[0] ?? "list";
  const [view, setView] = useState<string>(defaultView);

  return (
    <Tabs
      className="w-full gap-0"
      defaultValue={defaultView}
      onValueChange={setView}
    >
      <div className="sticky top-0 z-10 bg-background pt-16">
        <div className="flex w-full items-center justify-between pb-2.5">
          {searchEnabled && <Input placeholder="Search" type="search" />}
          {enabledViews.length > 1 && (
            <TabsList>
              {enabledViews.includes("list") && (
                <TabsTrigger value="list">List</TabsTrigger>
              )}
              {enabledViews.includes("grid") && (
                <TabsTrigger value="grid">Grid</TabsTrigger>
              )}
              {enabledViews.includes("map") && (
                <TabsTrigger value="map">Map</TabsTrigger>
              )}
            </TabsList>
          )}
        </div>
        {view === "list" && enabledViews.includes("list") && (
          <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
            {listColumns.map((column) => (
              <li className={column.className} key={column.label}>
                {column.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {enabledViews.includes("list") && (
        <TabsContent value="list">
          {items.length > 0 ? (
            items.map((item) => renderListItem(item))
          ) : (
            <p className="text-center text-muted-foreground">{emptyMessage}</p>
          )}
        </TabsContent>
      )}

      {enabledViews.includes("grid") && (
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-1.5">
            {items.length > 0 ? (
              items.map((item) => renderGridItem(item))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">
                {emptyMessage}
              </p>
            )}
          </div>
        </TabsContent>
      )}

      {enabledViews.includes("map") && markers && (
        <TabsContent value="map">
          <ResourceMapView markers={markers} />
        </TabsContent>
      )}
    </Tabs>
  );
}
