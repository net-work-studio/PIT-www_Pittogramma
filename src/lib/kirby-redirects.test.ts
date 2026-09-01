import { describe, expect, test } from "bun:test";

import { getKirbyRedirects } from "@/lib/kirby-redirects";

describe("getKirbyRedirects", () => {
  const redirects = getKirbyRedirects();

  test("keeps every redirect source unique", () => {
    const sources = redirects.map((redirect) => redirect.source);

    expect(new Set(sources).size).toBe(sources.length);
  });

  test("maps renamed editorial slugs to their verified successors", () => {
    expect(redirects).toContainEqual({
      destination: "/projects/crumbs-guida-digitale-alla-petizione-online",
      permanent: true,
      source: "/en/projects/crumbs",
    });
    expect(redirects).toContainEqual({
      destination: "/interviews/valentina-casali",
      permanent: true,
      source: "/it/interviste/sunday-buro",
    });
    expect(redirects).toContainEqual({
      destination: "/designers/martina-bignotti",
      permanent: true,
      source: "/en/designers/martina-costa-bignotti",
    });
  });

  test("keeps retired edition URLs temporary while they point to the homepage", () => {
    expect(redirects).toContainEqual({
      destination: "/",
      permanent: false,
      source: "/en/editions/:path*",
    });
  });

  test("preserves former resource and archive aliases", () => {
    expect(redirects).toContainEqual({
      destination: "/studios-agencies",
      permanent: true,
      source: "/:language(en|it)/archivio/studios/:path*",
    });
    expect(redirects).toContainEqual({
      destination: "/designers",
      permanent: true,
      source: "/:language(en|it)/archive/designers/:path*",
    });
  });
});
