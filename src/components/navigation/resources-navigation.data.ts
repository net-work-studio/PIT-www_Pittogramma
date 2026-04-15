export const resources = [
  {
    key: "bibliography" as const,
    label: "Bibliography",
    href: "/bibliography",
  },
  {
    key: "bookshops" as const,
    label: "Bookshops",
    href: "/bookshops",
  },
  {
    key: "glossary" as const,
    label: "Glossary",
    href: "/glossary",
  },
  {
    key: "institutes" as const,
    label: "Institutes",
    href: "/institutes",
  },
  {
    key: "studios-agencies" as const,
    label: "Studios & Agencies",
    href: "/studios-agencies",
  },
  {
    key: "type-foundries" as const,
    label: "Type Foundries",
    href: "/type-foundries",
  },
  {
    key: "websites" as const,
    label: "Websites",
    href: "/websites",
  },
];

export type Resource = (typeof resources)[number];
