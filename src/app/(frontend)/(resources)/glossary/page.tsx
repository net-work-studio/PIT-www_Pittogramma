import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import PageHeader from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getEnabledResources,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { GLOSSARY_QUERY } from "@/sanity/lib/queries";
import type { GLOSSARY_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "A list of the most common and used terms in the design industry",
};

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

  for (let i = 0; i < groups.length; i++) {
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
            word={item.name}
          />
        ))}
      </div>
    </div>
  );
}

interface GlossaryCardProps {
  definition: string;
  word: string;
}

function GlossaryCard({ word, definition }: GlossaryCardProps) {
  return (
    <Accordion className="rounded-lg bg-secondary p-2.5">
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
  const { data: glossaryItems } = await sanityFetch({
    query: GLOSSARY_QUERY,
    perspective,
    stega,
  });

  const groupedGlossary = groupByFirstLetter(glossaryItems);
  const [leftColumn, rightColumn] = splitIntoColumns(groupedGlossary);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A list of the most common and used terms in the design industry"
          title="Glossary"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
        {isSearchEnabled("glossary") && <SearchInput />}
      </div>
      <section className="grid grid-cols-1 gap-x-2.5 pt-30 md:grid-cols-2">
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
    </>
  );
}
