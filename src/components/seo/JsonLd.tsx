type JsonLdType =
  | "Organization"
  | "Article"
  | "CreativeWork"
  | "BreadcrumbList"
  | "WebSite"
  | "Person";

interface JsonLdProps {
  type: JsonLdType;
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires this pattern and JSON.stringify output is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      id={`json-ld-${type.toLowerCase()}`}
      type="application/ld+json"
    />
  );
}
