import kirbyUrlMap from "../../data/kirby-url-map.json";

interface KirbyUrlMapping {
  destination: string;
  source: string;
}

interface KirbyUrlMap {
  mappings: KirbyUrlMapping[];
}

export interface KirbyRedirect {
  destination: string;
  permanent: boolean;
  source: string;
}

function validateKirbyUrlMap(raw: unknown): KirbyUrlMap {
  if (!raw || typeof raw !== "object" || !("mappings" in raw)) {
    throw new Error("Kirby URL map must contain mappings");
  }

  const { mappings } = raw as { mappings: unknown };
  if (!Array.isArray(mappings)) {
    throw new Error("Kirby URL map mappings must be an array");
  }

  const seenSources = new Set<string>();
  return {
    mappings: mappings.map((mapping, index) => {
      if (!mapping || typeof mapping !== "object") {
        throw new Error(`Kirby URL map mapping ${index} must be an object`);
      }

      const { destination, source } = mapping as Record<string, unknown>;
      if (
        typeof source !== "string" ||
        !source.startsWith("/") ||
        typeof destination !== "string" ||
        !destination.startsWith("/")
      ) {
        throw new Error(`Kirby URL map mapping ${index} has an invalid path`);
      }

      if (seenSources.has(source)) {
        throw new Error(`Kirby URL map has duplicate source ${source}`);
      }
      seenSources.add(source);

      return { destination, source };
    }),
  };
}

const STATIC_REDIRECTS: KirbyRedirect[] = [
  { destination: "/", permanent: true, source: "/en" },
  { destination: "/", permanent: true, source: "/it" },
  { destination: "/about", permanent: true, source: "/en/info" },
  { destination: "/about", permanent: true, source: "/it/info" },
  {
    destination: "/projects",
    permanent: true,
    source: "/en/projects",
  },
  {
    destination: "/projects",
    permanent: true,
    source: "/it/progetti",
  },
  {
    destination: "/interviews",
    permanent: true,
    source: "/en/interviews",
  },
  {
    destination: "/interviews",
    permanent: true,
    source: "/it/interviste",
  },
  {
    destination: "/designers",
    permanent: true,
    source: "/en/designers",
  },
  {
    destination: "/designers",
    permanent: true,
    source: "/it/designers",
  },
  {
    destination: "/studios-agencies",
    permanent: true,
    source: "/en/archivio",
  },
  {
    destination: "/studios-agencies",
    permanent: true,
    source: "/it/archivio",
  },
  {
    destination: "/privacy-policy",
    permanent: true,
    source: "/en/privacy-policy",
  },
  {
    destination: "/privacy-policy",
    permanent: true,
    source: "/it/privacy-policy",
  },
  {
    destination: "/cookie-policy",
    permanent: true,
    source: "/en/cookie-policy",
  },
  {
    destination: "/cookie-policy",
    permanent: true,
    source: "/it/cookie-policy",
  },
  { destination: "/sitemap.xml", permanent: true, source: "/sitemap" },
  {
    destination: "/projects",
    permanent: true,
    source: "/en/projects/page\\:2",
  },
  {
    destination: "/projects",
    permanent: true,
    source: "/en/projects/page\\:3",
  },
  {
    destination: "/projects",
    permanent: true,
    source: "/it/progetti/page\\:2",
  },
  {
    destination: "/projects",
    permanent: true,
    source: "/it/progetti/page\\:3",
  },
  { destination: "/designers", permanent: true, source: "/repository" },
];

const PATTERN_REDIRECTS: KirbyRedirect[] = [
  {
    destination: "/",
    permanent: false,
    source: "/en/editions/:path*",
  },
  {
    destination: "/",
    permanent: false,
    source: "/it/edizioni/:path*",
  },
  {
    destination: "/studios-agencies",
    permanent: true,
    source: "/:language(en|it)/archivio/studios/:path*",
  },
  {
    destination: "/institutes",
    permanent: true,
    source: "/:language(en|it)/archivio/istituti/:path*",
  },
  {
    destination: "/institutes",
    permanent: true,
    source: "/:language(en|it)/archivio/institutes/:path*",
  },
  {
    destination: "/bookshops",
    permanent: true,
    source: "/:language(en|it)/archivio/librerie-indipendenti/:path*",
  },
  {
    destination: "/bookshops",
    permanent: true,
    source: "/:language(en|it)/archivio/bookshops/:path*",
  },
  {
    destination: "/designers",
    permanent: true,
    source: "/:language(en|it)/archive",
  },
  {
    destination: "/designers",
    permanent: true,
    source: "/:language(en|it)/archive/designers/:path*",
  },
  {
    destination: "/studios-agencies",
    permanent: true,
    source: "/:language(en|it)/archive/studios/:path*",
  },
  {
    destination: "/institutes",
    permanent: true,
    source: "/:language(en|it)/archive/institutes/:path*",
  },
  {
    destination: "/bookshops",
    permanent: true,
    source: "/:language(en|it)/archive/bookshops/:path*",
  },
  {
    destination: "/designers",
    permanent: true,
    source: "/:language(en|it)/repository/designers/:path*",
  },
  {
    destination: "/studios-agencies",
    permanent: true,
    source: "/:language(en|it)/repository/studios/:path*",
  },
  {
    destination: "/institutes",
    permanent: true,
    source: "/:language(en|it)/repository/institutes/:path*",
  },
  {
    destination: "/bookshops",
    permanent: true,
    source: "/:language(en|it)/repository/bookshops/:path*",
  },
];

export function getKirbyRedirects(): KirbyRedirect[] {
  const map = validateKirbyUrlMap(kirbyUrlMap);

  return [
    ...STATIC_REDIRECTS,
    ...PATTERN_REDIRECTS,
    ...map.mappings.map((mapping) => ({ ...mapping, permanent: true })),
  ];
}
