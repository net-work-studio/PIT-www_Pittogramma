import SearchInput from "@/components/feat/search-input";
import PageHeader from "@/components/shared/page-header";
import ResourcesNavigation from "@/components/navigation/resources-navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const glossaryData = {
  A: [
    {
      word: "Ascender",
      definition:
        "The part of a lowercase letter that extends above the x-height, such as in 'b', 'd', 'f', 'h', 'k', 'l', 't'.",
    },
    {
      word: "Alignment",
      definition:
        "The positioning of text elements relative to a common reference point, such as left, right, center, or justified alignment.",
    },
    {
      word: "Aperture",
      definition:
        "The partially enclosed space in characters like 'c', 'e', 'f', 'g', 'j', 'r', 's', 'y'.",
    },
    {
      word: "Antialiasing",
      definition:
        "A technique used to smooth jagged edges in digital fonts and graphics by blending pixels at the edges.",
    },
    {
      word: "Arm",
      definition:
        "A horizontal stroke that doesn't connect to a stroke or stem on one or both ends, as in 'T' or 'F'.",
    },
    {
      word: "Axis",
      definition:
        "An imaginary line drawn from top to bottom of a glyph, bisecting the upper and lower strokes.",
    },
  ],
  B: [
    {
      word: "Baseline",
      definition:
        "The invisible line upon which most letters sit. It's the reference point for vertical alignment in typography.",
    },
    {
      word: "Bold",
      definition:
        "A font weight that is heavier than normal, creating a stronger visual presence in text.",
    },
  ],
  C: [
    {
      word: "Cap Height",
      definition:
        "The height of capital letters from the baseline to the top of the letter, measured in the same units as the font size.",
    },
    {
      word: "Character",
      definition:
        "Any individual letter, number, punctuation mark, or symbol that can be typed or displayed.",
    },
    {
      word: "Counter",
      definition:
        "The enclosed or partially enclosed space within letters like 'a', 'b', 'd', 'e', 'g', 'o', 'p', 'q'.",
    },
    {
      word: "Condensed",
      definition:
        "A typeface style with characters that are narrower than normal, allowing more text to fit in a given space.",
    },
    {
      word: "Cursive",
      definition:
        "A typeface style that mimics handwriting, with connected or flowing letterforms.",
    },
    {
      word: "Crossbar",
      definition:
        "A horizontal stroke that connects two stems, as in 'A' or 'H'.",
    },
  ],
  D: [
    {
      word: "Descender",
      definition:
        "The part of a lowercase letter that extends below the baseline, such as in 'g', 'j', 'p', 'q', 'y'.",
    },
    {
      word: "Display Type",
      definition:
        "Large, decorative typefaces used for headlines, titles, and other prominent text elements.",
    },
  ],
  E: [
    {
      word: "Em Dash",
      definition:
        "A long dash (—) used to indicate a break in thought or to set off parenthetical elements.",
    },
    {
      word: "En Dash",
      definition:
        "A medium-length dash (–) used to indicate ranges, such as in 'pages 10–15' or '1990–2000'.",
    },
  ],
  F: [
    {
      word: "Font",
      definition:
        "A complete set of characters in a particular typeface, size, and style. Often used interchangeably with 'typeface'.",
    },
    {
      word: "Font Family",
      definition:
        "A collection of related typefaces that share common design characteristics but vary in weight, style, or width.",
    },
  ],
  G: [
    {
      word: "Glyph",
      definition:
        "A specific form of a character, including letters, numbers, punctuation marks, and symbols.",
    },
    {
      word: "Grid",
      definition:
        "A system of horizontal and vertical lines used to organize and align design elements consistently.",
    },
  ],
  H: [
    {
      word: "Hierarchy",
      definition:
        "The visual organization of information through different font sizes, weights, and styles to guide the reader's attention.",
    },
    {
      word: "Hyphenation",
      definition:
        "The process of breaking words at the end of lines to create more even text flow and reduce excessive white space.",
    },
  ],
  I: [
    {
      word: "Italic",
      definition:
        "A slanted style of typeface that mimics handwriting and is used for emphasis or to distinguish certain text elements.",
    },
    {
      word: "Ink Trap",
      definition:
        "Small notches or cuts in letterforms where strokes meet, designed to prevent ink from filling in during printing.",
    },
  ],
  J: [
    {
      word: "Justified",
      definition:
        "Text alignment where both left and right edges are straight, achieved by adjusting word and letter spacing.",
    },
  ],
  K: [
    {
      word: "Kerning",
      definition:
        "The adjustment of space between individual letter pairs to improve visual appearance and readability.",
    },
    {
      word: "Kern",
      definition:
        "The part of a character that extends beyond its body, such as the overhang of 'T' or 'V'.",
    },
  ],
  L: [
    {
      word: "Leading",
      definition:
        "The vertical space between lines of text, measured from baseline to baseline.",
    },
    {
      word: "Ligature",
      definition:
        "Two or more characters combined into a single glyph, such as 'fi', 'fl', or 'ff'.",
    },
  ],
  M: [
    {
      word: "Monospace",
      definition:
        "A typeface where all characters occupy the same width, commonly used in coding and tabular data.",
    },
    {
      word: "Margin",
      definition:
        "The white space around the edges of a page or text block that frames the content.",
    },
  ],
  N: [
    {
      word: "Negative Space",
      definition:
        "The empty space around and between design elements, also known as white space.",
    },
  ],
  O: [
    {
      word: "OpenType",
      definition:
        "A cross-platform font format that supports advanced typographic features and extended character sets.",
    },
    {
      word: "Orphan",
      definition:
        "A single word or short line that appears alone at the bottom of a page or column.",
    },
  ],
  P: [
    {
      word: "Point Size",
      definition:
        "The measurement used to specify font size, where 1 point equals 1/72 of an inch.",
    },
    {
      word: "Pica",
      definition:
        "A unit of measurement in typography, equal to 12 points or approximately 1/6 of an inch.",
    },
  ],
  Q: [
    {
      word: "Quotation Marks",
      definition:
        "Punctuation marks used to indicate speech, quotations, or emphasis in text.",
    },
  ],
  R: [
    {
      word: "Raster",
      definition:
        "An image format composed of pixels, as opposed to vector graphics which use mathematical equations.",
    },
    {
      word: "Rag",
      definition:
        "The irregular or uneven edge of a block of text, particularly in left-aligned or right-aligned text.",
    },
  ],
  S: [
    {
      word: "Serif",
      definition:
        "Small decorative strokes or flourishes at the ends of letter strokes, characteristic of serif typefaces.",
    },
    {
      word: "Sans Serif",
      definition:
        "Typefaces without serifs, characterized by clean, simple letterforms without decorative flourishes.",
    },
    {
      word: "Small Caps",
      definition:
        "Capital letters that are smaller than regular capitals, designed to match the x-height of lowercase letters.",
    },
    {
      word: "Stem",
      definition:
        "The main vertical stroke of a letter, such as in 'b', 'd', 'h', 'k', 'l', 't'.",
    },
    {
      word: "Stress",
      definition:
        "The angle of the axis of a typeface, which affects the overall character of the letterforms.",
    },
    {
      word: "Script",
      definition:
        "A typeface style that mimics handwriting or calligraphy, often with flowing, connected letterforms.",
    },
  ],
  T: [
    {
      word: "Tracking",
      definition:
        "The uniform adjustment of space between all characters in a word or line of text.",
    },
    {
      word: "Typeface",
      definition:
        "The design of a set of characters, including letters, numbers, and symbols, with consistent visual characteristics.",
    },
    {
      word: "Typography",
      definition:
        "The art and technique of arranging type to make written language legible, readable, and visually appealing.",
    },
    {
      word: "Terminal",
      definition:
        "The end of a stroke that doesn't include a serif, often found in sans-serif typefaces.",
    },
    {
      word: "Thin",
      definition:
        "A very light font weight, lighter than light, used for delicate or elegant text treatments.",
    },
    {
      word: "Tabular",
      definition:
        "Numbers designed to align vertically in columns, with each digit taking up the same width.",
    },
  ],
  U: [
    {
      word: "Uppercase",
      definition:
        "Capital letters, also known as majuscules, typically used at the beginning of sentences and for proper nouns.",
    },
  ],
  V: [
    {
      word: "Vector",
      definition:
        "A graphics format that uses mathematical equations to define shapes, allowing for infinite scalability without quality loss.",
    },
  ],
  W: [
    {
      word: "Widow",
      definition:
        "A single word or short line that appears alone at the top of a page or column.",
    },
    {
      word: "Weight",
      definition:
        "The thickness or boldness of a typeface, ranging from thin to black.",
    },
  ],
  X: [
    {
      word: "X-Height",
      definition:
        "The height of lowercase letters without ascenders or descenders, measured from the baseline to the top of letters like 'x'.",
    },
  ],
  Y: [
    {
      word: "Y-Axis",
      definition:
        "The vertical axis in a coordinate system, often used in design software for positioning elements.",
    },
  ],
  Z: [
    {
      word: "Z-Index",
      definition:
        "A CSS property that controls the stacking order of positioned elements, determining which elements appear in front of others.",
    },
  ],
};

function LetterSection({
  letter,
  words,
}: {
  letter: string;
  words: Array<{ word: string; definition: string }>;
}) {
  return (
    <div className="space-y-5">
      <h2 className="border-b pb-2 pl-2.5 text-xs uppercase">{letter}</h2>
      <div className="space-y-1.5">
        {words.map((item, index) => (
          <GlossaryCard
            definition={item.definition}
            key={index}
            word={item.word}
          />
        ))}
      </div>
    </div>
  );
}

type GlossaryCardProps = {
  word: string;
  definition: string;
};

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

export default function Page() {
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
        {Object.entries(glossaryData).map(([letter, words]) => (
          <LetterSection key={letter} letter={letter} words={words} />
        ))}
      </section>
    </>
  );
}
