"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import type { ResourceMapMarker } from "@/components/resources/resource-map-view";
import ResourceMapView from "@/components/resources/resource-map-view-wrapper";
import {
  useResourceTarget,
  useScrollToResourceTarget,
} from "@/components/resources/resource-target";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/feature-flags";
import { getResourceTargetElementId } from "@/lib/resource-target";

export interface ResourceListColumn {
  className: string;
  label: string;
}

interface ResourceViewTabsProps<T extends { _id: string }> {
  emptyMessage: string;
  enabledViews: ViewMode[];
  items: T[];
  listColumns: ResourceListColumn[];
  markers?: ResourceMapMarker[];
  renderGridItem: (item: T) => ReactNode;
  renderListItem: (item: T) => ReactNode;
  searchEnabled: boolean;
}

export function ResourceViewTabs<T extends { _id: string }>({
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
  const resourceIds = useMemo(() => items.map((item) => item._id), [items]);
  const targetResourceId = useResourceTarget(resourceIds);
  let targetView: "grid" | "list" | null = null;
  if (enabledViews.includes("list")) {
    targetView = "list";
  } else if (enabledViews.includes("grid")) {
    targetView = "grid";
  }

  useEffect(() => {
    if (targetResourceId && targetView) {
      setView(targetView);
    }
  }, [targetResourceId, targetView]);

  useScrollToResourceTarget(
    targetResourceId,
    Boolean(targetView && view === targetView)
  );

  return (
    <Tabs className="w-full gap-0" onValueChange={setView} value={view}>
      <div className="sticky top-0 z-10 bg-background pt-16">
        <div className="flex w-full items-center justify-between pb-2.5">
          {searchEnabled ? <Input placeholder="Search" type="search" /> : null}
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
            items.map((item) => (
              <div
                id={
                  view === "list"
                    ? getResourceTargetElementId(item._id)
                    : undefined
                }
                key={item._id}
              >
                {renderListItem(item)}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">{emptyMessage}</p>
          )}
        </TabsContent>
      )}

      {enabledViews.includes("grid") && (
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-1.5">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  id={
                    view === "grid"
                      ? getResourceTargetElementId(item._id)
                      : undefined
                  }
                  key={item._id}
                >
                  {renderGridItem(item)}
                </div>
              ))
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
