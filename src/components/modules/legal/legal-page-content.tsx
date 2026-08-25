import { PortableText, type PortableTextComponents } from "next-sanity";

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

interface LegalPageContentProps {
  content: Parameters<typeof PortableText>[0]["value"];
}

export default function LegalPageContent({ content }: LegalPageContentProps) {
  return <PortableText components={components} value={content} />;
}
