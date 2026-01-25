import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { TagsDisplay } from "@/components/resources/tags-display";
import PageHeader from "@/components/shared/page-header";
import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, WEB_SOURCES_QUERY } from "@/sanity/lib/queries";
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

function WebSourceCard({
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
        <TagsDisplay tags={source.tagSelector?.tags} />
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

export default async function Page() {
  const [{ data: sources }, { data: settings }] = await Promise.all([
    sanityFetch({ query: WEB_SOURCES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const utmSettings: UtmSettings = {
    utmSource: settings?.utmSource,
    utmMedium: settings?.utmMedium,
    utmCampaign: settings?.utmCampaign,
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A curated list of websites and online resources for designers"
          title="Websites"
        />
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <div className="space-y-5 pt-30">
        <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase">
          <li className="col-span-4">Name</li>
          <li className="col-span-2">Category</li>
          <li className="col-span-2">Tag</li>
          <li className="col-span-4">Website</li>
        </ul>
        <section className="flex flex-col gap-1.5">
          {sources.length > 0 ? (
            sources.map((source) => (
              <WebSourceCard
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
      </div>
    </>
  );
}
