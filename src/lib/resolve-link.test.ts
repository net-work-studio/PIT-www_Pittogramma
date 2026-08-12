import { describe, expect, test } from "bun:test";

import { resolveInternalLink } from "./resolve-link";

describe("resolveInternalLink", () => {
  test("resolves each Resource page singleton to its fixed route", () => {
    expect(resolveInternalLink({ _type: "bibliographyPage" })).toBe(
      "/bibliography"
    );
    expect(resolveInternalLink({ _type: "bookshopsPage" })).toBe("/bookshops");
    expect(resolveInternalLink({ _type: "glossaryPage" })).toBe("/glossary");
    expect(resolveInternalLink({ _type: "institutesPage" })).toBe(
      "/institutes"
    );
    expect(resolveInternalLink({ _type: "studiosAgenciesPage" })).toBe(
      "/studios-agencies"
    );
    expect(resolveInternalLink({ _type: "typeFoundriesPage" })).toBe(
      "/type-foundries"
    );
    expect(resolveInternalLink({ _type: "websitesPage" })).toBe("/websites");
  });

  test("continues resolving document links with their slug", () => {
    expect(
      resolveInternalLink({
        _type: "project",
        slug: { current: "poster-series" },
      })
    ).toBe("/projects/poster-series");
  });
});
