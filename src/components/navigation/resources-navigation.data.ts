export const resources = [
  {
    href: "/studios-agencies",
    key: "studios-agencies" as const,
    label: "Studios & Agencies",
  },
  {
    href: "/type-foundries",
    key: "type-foundries" as const,
    label: "Type Foundries",
  },
  {
    href: "/institutes",
    key: "institutes" as const,
    label: "Institutes",
  },
  {
    href: "/bookshops",
    key: "bookshops" as const,
    label: "Bookshops",
  },
  {
    href: "/websites",
    key: "websites" as const,
    label: "Websites",
  },
  {
    href: "/bibliography",
    key: "bibliography" as const,
    label: "Bibliography",
  },
  {
    href: "/glossary",
    key: "glossary" as const,
    label: "Glossary",
  },
];

export type Resource = (typeof resources)[number];
