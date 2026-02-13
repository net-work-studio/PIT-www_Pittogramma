import { PortableText, type PortableTextComponents } from "next-sanity";

import type { JOURNAL_ARTICLE_QUERY_RESULT } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mx-auto mb-4 max-w-[700px] text-base leading-relaxed lg:text-xl">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mx-auto mt-10 mb-4 max-w-[700px] text-xl leading-tight lg:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mx-auto mt-8 mb-3 max-w-[700px] text-lg leading-tight lg:text-xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mx-auto my-8 max-w-[700px] text-2xl leading-tight lg:text-[2.5rem] lg:leading-tight">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        className="underline"
        href={value?.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    ),
  },
};

type JournalContentBlocks = NonNullable<
  NonNullable<JOURNAL_ARTICLE_QUERY_RESULT>["content"]
>;

interface JournalContentProps {
  content?: JournalContentBlocks | null;
}

export default function JournalContent({ content }: JournalContentProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="px-2.5">
      <PortableText components={components} value={content} />
    </div>
  );
}
