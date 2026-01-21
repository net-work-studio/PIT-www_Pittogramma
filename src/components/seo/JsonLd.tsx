type JsonLdType =
  | "Organization"
  | "Article"
  | "CreativeWork"
  | "BreadcrumbList"
  | "WebSite"
  | "Person";

type JsonLdProps = {
  type: JsonLdType;
  data: Record<string, unknown>;
};

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script id={`json-ld-${type.toLowerCase()}`} type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </script>
  );
}
