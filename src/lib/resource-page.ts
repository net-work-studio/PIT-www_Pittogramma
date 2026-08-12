export const RESOURCE_PAGE_DEFAULTS = {
  bibliography: {
    introText: "A constantly updated list of books on graphic design",
    route: "/bibliography",
    title: "Bibliography",
    type: "bibliographyPage",
  },
  bookshops: {
    introText: "A mapping of independent bookshops around the world",
    route: "/bookshops",
    title: "Bookshops",
    type: "bookshopsPage",
  },
  glossary: {
    introText:
      "A list of the most common and used terms in the design industry",
    route: "/glossary",
    title: "Glossary",
    type: "glossaryPage",
  },
  institutes: {
    introText:
      "A mapping of the institutes, schools and universities around the world",
    route: "/institutes",
    title: "Institutes",
    type: "institutesPage",
  },
  studiosAgencies: {
    introText: "A mapping of the creative realities around the world",
    route: "/studios-agencies",
    title: "Studios & Agencies",
    type: "studiosAgenciesPage",
  },
  typeFoundries: {
    introText: "A mapping of the creative realities around the world",
    route: "/type-foundries",
    title: "Type Foundries",
    type: "typeFoundriesPage",
  },
  websites: {
    introText: "A curated list of websites and online resources for designers",
    route: "/websites",
    title: "Websites",
    type: "websitesPage",
  },
} as const;

export const RESOURCE_PAGE_ROUTES = Object.fromEntries(
  Object.values(RESOURCE_PAGE_DEFAULTS).map(({ route, type }) => [type, route])
) as Record<
  (typeof RESOURCE_PAGE_DEFAULTS)[keyof typeof RESOURCE_PAGE_DEFAULTS]["type"],
  string
>;
