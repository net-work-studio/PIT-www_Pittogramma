type JsonLdType =
  | "Organization"
  | "Article"
  | "CreativeWork"
  | "BreadcrumbList"
  | "WebSite"
  | "Person"
  | "Event"
  | "Book"
  | "AboutPage";

interface JsonLdProps {
  data: Record<string, unknown>;
  type: JsonLdType;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      // JSON-LD requires an inline script. Escaping `<` prevents user-authored
      // CMS text from terminating the script element.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires this pattern
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
      id={`json-ld-${type.toLowerCase()}`}
      type="application/ld+json"
    />
  );
}
