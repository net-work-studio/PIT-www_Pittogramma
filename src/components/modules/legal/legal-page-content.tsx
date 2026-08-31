import { PortableText, type PortableTextComponents } from "next-sanity";

const EXTERNAL_HTTP_URL = /^https?:\/\//i;

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-xl leading-tight lg:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-lg leading-tight lg:text-xl">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 whitespace-pre-line text-base leading-relaxed lg:text-xl">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-relaxed lg:text-xl">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-base leading-relaxed lg:text-xl">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      if (!value?.href) {
        return children;
      }

      const isExternal = EXTERNAL_HTTP_URL.test(value.href);

      return (
        <a
          className="underline"
          href={value.href}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

interface LegalPageContentProps {
  content: Parameters<typeof PortableText>[0]["value"];
}

export default function LegalPageContent({ content }: LegalPageContentProps) {
  return <PortableText components={components} value={content} />;
}
