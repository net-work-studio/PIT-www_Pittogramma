"use client";

import { useState } from "react";

import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";
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
  return (
    <ResourceListItem>
      <li className="col-span-4">{source.name}</li>
      <li className="col-span-2">{source.category?.name || "-"}</li>
      <li className="col-span-2">
        <TagsDisplay tags={source.tags} />
      </li>
      <li className="col-span-4">
        {source.sourceUrl ? (
          <a
            className="underline hover:no-underline"
            href={buildTrackedLink(source.sourceUrl, "website", utmSettings)}
            rel="noopener noreferrer"
            target="_blank"
          >
            {formatUrl(source.sourceUrl)}
          </a>
        ) : (
          "-"
        )}
      </li>
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
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary p-2.5">
      <span className="font-medium">{source.name}</span>
      <span className="text-muted-foreground text-sm">
        {source.category?.name || "-"}
      </span>
      <span className="text-muted-foreground text-sm">
        <TagsDisplay tags={source.tags} />
      </span>
      {source.sourceUrl ? (
        <a
          className="text-sm underline hover:no-underline"
          href={buildTrackedLink(source.sourceUrl, "website", utmSettings)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {formatUrl(source.sourceUrl)}
        </a>
      ) : (
        <span className="text-sm">-</span>
      )}
    </div>
  );
}

interface WebsitesContentProps {
  sources: WEB_SOURCES_QUERY_RESULT;
  utmSettings: UtmSettings;
}

export function WebsitesContent({
  sources,
  utmSettings,
}: WebsitesContentProps) {
  const [view, setView] = useState("list");

  return (
    <Tabs className="w-full gap-0" defaultValue="list" onValueChange={setView}>
      <div className="sticky top-0 z-10 bg-background pt-16 pb-2.5">
        <div className="flex w-full items-center justify-between pb-2.5">
          <Input placeholder="Search" type="search" />
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>
        </div>
        {view === "list" && (
          <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
            <li className="col-span-4">Name</li>
            <li className="col-span-2">Category</li>
            <li className="col-span-2">Tag</li>
            <li className="col-span-4">Website</li>
          </ul>
        )}
      </div>

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
    </Tabs>
  );
}
