import SearchInput from "@/components/feat/search-input";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import PageHeader from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sanityFetch } from "@/sanity/lib/live";
import { GLOSSARY_QUERY } from "@/sanity/lib/queries";
import type { GLOSSARY_QUERY_RESULT } from "@/sanity/types";

type GlossaryItem = GLOSSARY_QUERY_RESULT[number];

interface GroupedGlossary {
  letter: string;
  words: GlossaryItem[];
}

function groupByFirstLetter(items: GlossaryItem[]): GroupedGlossary[] {
  const grouped = items.reduce<Record<string, GlossaryItem[]>>((acc, item) => {
    const firstLetter = item.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, words]) => ({ letter, words }));
}

function LetterSection({ letter, words }: GroupedGlossary) {
  return (
    <div className="space-y-5">
      <h2 className="border-b pb-2 pl-2.5 text-xs uppercase">{letter}</h2>
      <div className="space-y-1.5">
        {words.map((item) => (
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
  word: string;
  definition: string;
}

function GlossaryCard({ word, definition }: GlossaryCardProps) {
  return (
    <Accordion
      className="rounded-lg bg-secondary p-2.5"
      collapsible
      type="single"
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
  const { data: glossaryItems } = await sanityFetch({
    query: GLOSSARY_QUERY,
  });

  const groupedGlossary = groupByFirstLetter(glossaryItems);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A list of the most common and used terms in the design industry"
          title="Glossary"
        />
        <ResourcesNavigation />
        <SearchInput />
      </div>
      <section className="columns-2 gap-2.5 space-y-5 pt-30">
        {groupedGlossary.length > 0 ? (
          groupedGlossary.map((group) => (
            <LetterSection
              key={group.letter}
              letter={group.letter}
              words={group.words}
            />
          ))
        ) : (
          <p className="col-span-2 text-center text-muted-foreground">
            No glossary terms available yet.
          </p>
        )}
      </section>
    </>
  );
}
