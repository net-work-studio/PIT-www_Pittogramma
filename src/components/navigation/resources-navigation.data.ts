export const resources = [
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
    key: "institutes" as const,
    label: "Institutes",
    href: "/institutes",
  },
  {
    key: "bookshops" as const,
    label: "Bookshops",
    href: "/bookshops",
  },
  {
    key: "websites" as const,
    label: "Websites",
    href: "/websites",
  },
  {
    key: "glossary" as const,
    label: "Glossary",
    href: "/glossary",
  },
  {
    key: "bibliography" as const,
    label: "Bibliography",
    href: "/bibliography",
  },
];

export type Resource = (typeof resources)[number];
