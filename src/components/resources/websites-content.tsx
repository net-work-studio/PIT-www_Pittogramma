"use client";

import { useState } from "react";

import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ViewMode } from "@/lib/feature-flags";
import { buildResourceHref } from "@/lib/resource-website-url";
import type { UtmSettings } from "@/lib/tracked-link";
import type { WEB_SOURCES_QUERY_RESULT } from "@/sanity/types";

type WebSource = WEB_SOURCES_QUERY_RESULT[number];

const WWW_PREFIX_REGEX = /^www\./;

function formatUrl(url: string | null): string {
  if (!url) {
    return "-";
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(WWW_PREFIX_REGEX, "");
  } catch {
    return url;
  }
}

function WebSourceListCard({
  source,
  utmSettings,
}: {
  source: WebSource;
  utmSettings: UtmSettings;
}) {
  const href = buildResourceHref(source.sourceUrl, "website", utmSettings);

  return (
    <ResourceListItem href={href}>
      <span className="col-span-4">{source.name}</span>
      <span className="col-span-2">{source.category?.name || "-"}</span>
      <span className="col-span-2">
        <TagsDisplay tags={source.tags} />
      </span>
      <span className="col-span-4">
        {source.sourceUrl ? formatUrl(source.sourceUrl) : "-"}
      </span>
    </ResourceListItem>
  );
}

function WebSourceGridCard({
  source,
  utmSettings,
}: {
  source: WebSource;
  utmSettings: UtmSettings;
}) {
  const href = buildResourceHref(source.sourceUrl, "website", utmSettings);

  const card = (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
      <span className="font-medium">{source.name}</span>
      <span className="text-muted-foreground text-sm">
        {source.category?.name || "-"}
      </span>
      <span className="text-muted-foreground text-sm">
        <TagsDisplay tags={source.tags} />
      </span>
      <span className="text-sm">
        {source.sourceUrl ? formatUrl(source.sourceUrl) : "-"}
      </span>
    </div>
  );

  if (href) {
    return (
      <a
        className="no-underline"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {card}
      </a>
    );
  }

  return card;
}

interface WebsitesContentProps {
  enabledViews: ViewMode[];
  searchEnabled: boolean;
  sources: WEB_SOURCES_QUERY_RESULT;
  utmSettings: UtmSettings;
}

export function WebsitesContent({
  sources,
  enabledViews,
  searchEnabled,
  utmSettings,
}: WebsitesContentProps) {
  const defaultView = enabledViews[0] ?? "list";
  const [view, setView] = useState<string>(defaultView);

  return (
    <Tabs
      className="w-full gap-0"
      defaultValue={defaultView}
      onValueChange={setView}
    >
      <div className="sticky top-0 z-10 bg-background pt-16 pb-2.5">
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
            </TabsList>
          )}
        </div>
        {view === "list" && enabledViews.includes("list") && (
          <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
            <li className="col-span-4">Name</li>
            <li className="col-span-2">Category</li>
            <li className="col-span-2">Tag</li>
            <li className="col-span-4">Website</li>
          </ul>
        )}
      </div>

      {enabledViews.includes("list") && (
        <TabsContent value="list">
          <section className="flex flex-col gap-1.5">
            {sources.length > 0 ? (
              sources.map((source) => (
                <WebSourceListCard
                  key={source._id}
                  source={source}
                  utmSettings={utmSettings}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No websites available yet.
              </p>
            )}
          </section>
        </TabsContent>
      )}

      {enabledViews.includes("grid") && (
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-1.5">
            {sources.length > 0 ? (
              sources.map((source) => (
                <WebSourceGridCard
                  key={source._id}
                  source={source}
                  utmSettings={utmSettings}
                />
              ))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">
                No websites available yet.
              </p>
            )}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
