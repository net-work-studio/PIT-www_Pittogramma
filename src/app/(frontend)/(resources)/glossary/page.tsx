import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import CtaCard from "@/components/cards/cta-card";
import SearchInput from "@/components/feat/search-input";
import ResourcesHeader from "@/components/navigation/resources-header";
import { ResourceTargetScroller } from "@/components/resources/resource-target";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { isResourceEnabled, isSearchEnabled } from "@/lib/feature-flags";
import { RESOURCE_PAGE_DEFAULTS } from "@/lib/resource-page";
import { getResourceTargetElementId } from "@/lib/resource-target";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import { GLOSSARY_PAGE_QUERY, GLOSSARY_QUERY } from "@/sanity/lib/queries";
import type { GLOSSARY_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: GLOSSARY_PAGE_QUERY,
  });

  const defaults = RESOURCE_PAGE_DEFAULTS.glossary;
  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: page?.introText ?? defaults.introText,
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? defaults.title,
    },
    path: defaults.route,
    siteDefaults,
  });
}

type GlossaryItem = GLOSSARY_QUERY_RESULT[number];

interface GroupedGlossary {
  letter: string;
  words: GlossaryItem[];
}

function groupByFirstLetter(items: GlossaryItem[]): GroupedGlossary[] {
  const grouped: Record<string, GlossaryItem[]> = {};

  for (const item of items) {
    const firstLetter = item.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(item);
  }

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, words]) => ({ letter, words }));
}

/** Split groups into two balanced columns by item count, reading top-to-bottom. */
function splitIntoColumns(
  groups: GroupedGlossary[]
): [GroupedGlossary[], GroupedGlossary[]] {
  const totalItems = groups.reduce((sum, g) => sum + g.words.length, 0);
  const half = totalItems / 2;

  let runningCount = 0;
  let splitIndex = 0;

  for (let i = 0; i < groups.length; i += 1) {
    const nextCount = runningCount + groups[i].words.length;
    // Stop when adding the next group would cross the halfway mark —
    // unless the left column is still empty (at least one group per side).
    if (nextCount >= half && i > 0) {
      // Pick whichever split (before or after this group) is closer to half
      splitIndex = nextCount - half < half - runningCount ? i + 1 : i;
      break;
    }
    runningCount = nextCount;
    splitIndex = i + 1;
  }

  return [groups.slice(0, splitIndex), groups.slice(splitIndex)];
}

function LetterSection({ letter, words }: GroupedGlossary) {
  return (
    <div className="space-y-5">
      <h2 className="border-b pb-2 pl-2.5 text-xs uppercase">{letter}</h2>
      <div className="space-y-1.5">
        {words.map((item: GlossaryItem) => (
          <GlossaryCard
            definition={item.description}
            key={item._id}
            resourceId={item._id}
            word={item.name}
          />
        ))}
      </div>
    </div>
  );
}

interface GlossaryCardProps {
  definition: string;
  resourceId: string;
  word: string;
}

function GlossaryCard({ word, definition, resourceId }: GlossaryCardProps) {
  return (
    <Accordion
      className="rounded-lg bg-secondary p-2.5"
      id={getResourceTargetElementId(resourceId)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-0 font-mono uppercase">
          {word}
        </AccordionTrigger>
        <AccordionContent className="mt-2.5 max-w-prose p-0">
          {definition}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default async function Page() {
  if (!isResourceEnabled("glossary")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicGlossaryPage />
      </Suspense>
    );
  }
  return <CachedGlossaryPage perspective="published" stega={false} />;
}

async function DynamicGlossaryPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedGlossaryPage perspective={perspective} stega={stega} />;
}

async function CachedGlossaryPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [{ data: glossaryItems }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ perspective, query: GLOSSARY_QUERY, stega }),
    sanityFetch({ perspective, query: GLOSSARY_PAGE_QUERY, stega }),
  ]);

  const groupedGlossary = groupByFirstLetter(glossaryItems);
  const [leftColumn, rightColumn] = splitIntoColumns(groupedGlossary);
  const defaults = RESOURCE_PAGE_DEFAULTS.glossary;
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <ResourcesHeader
        intro={pageSettings?.introText ?? defaults.introText}
        title={defaults.title}
      >
        {isSearchEnabled("glossary") && <SearchInput />}
      </ResourcesHeader>
      <section className="grid grid-cols-1 gap-x-2.5 md:grid-cols-2">
        <ResourceTargetScroller
          resourceIds={glossaryItems.map((item) => item._id)}
        />
        {groupedGlossary.length > 0 ? (
          <>
            <div className="space-y-5">
              {leftColumn.map((group) => (
                <LetterSection
                  key={group.letter}
                  letter={group.letter}
                  words={group.words}
                />
              ))}
            </div>
            <div className="space-y-5">
              {rightColumn.map((group) => (
                <LetterSection
                  key={group.letter}
                  letter={group.letter}
                  words={group.words}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="col-span-2 text-center text-muted-foreground">
            No glossary terms available yet.
          </p>
        )}
      </section>
      {cta ? (
        <div className="pt-10 pb-10">
          <CtaCard
            buttonText={cta.buttonText}
            externalUrl={cta.externalUrl}
            headline={cta.headline}
            image={cta.image}
            internalLink={cta.internalLink}
            linkType={cta.linkType}
            variant={cta.variant}
          />
        </div>
      ) : null}
    </>
  );
}
