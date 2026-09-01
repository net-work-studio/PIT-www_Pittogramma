import { PortableText, type PortableTextComponents } from "next-sanity";

import { MediaBlock } from "@/components/modules/shared/media-blocks";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

const portableComponents: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => (
      <blockquote className="my-8 text-2xl leading-tight lg:text-[2.5rem] lg:leading-tight">
        {children}
      </blockquote>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-xl leading-tight lg:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-lg leading-tight lg:text-xl">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed lg:text-xl">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }) =>
      value?.href ? (
        <a
          className="underline"
          href={value.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      ) : (
        children
      ),
  },
};

type ContentItem = NonNullable<
  NonNullable<ABOUT_PAGE_QUERY_RESULT>["content"]
>[number];

interface AboutContentProps {
  content?: NonNullable<ABOUT_PAGE_QUERY_RESULT>["content"];
}

export default function AboutContent({ content }: AboutContentProps) {
  if (!content?.length) {
    return null;
  }

  type Group =
    | { kind: "text"; key: string; blocks: ContentItem[] }
    | { kind: "media"; key: string; block: ContentItem };

  const groups: Group[] = [];
  let textBuffer: ContentItem[] = [];
  let textStartKey: string | null = null;

  function flushText() {
    if (textBuffer.length > 0 && textStartKey) {
      groups.push({ blocks: textBuffer, key: textStartKey, kind: "text" });
      textBuffer = [];
      textStartKey = null;
    }
  }

  content.forEach((item, index) => {
    const key = (item as { _key?: string })._key ?? `about-content-${index}`;
    if (item._type === "block") {
      if (textStartKey === null) {
        textStartKey = key;
      }
      textBuffer.push(item);
    } else {
      flushText();
      groups.push({ block: item, key, kind: "media" });
    }
  });
  flushText();

  return (
    <div className="flex flex-col gap-10 lg:gap-16">
      {groups.map((group) =>
        group.kind === "text" ? (
          <div className="mx-auto w-full max-w-[700px]" key={group.key}>
            <PortableText
              components={portableComponents}
              value={group.blocks}
            />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1000px]" key={group.key}>
            <MediaBlock block={group.block} rounded="xl" showCaptions />
          </div>
        )
      )}
    </div>
  );
}
