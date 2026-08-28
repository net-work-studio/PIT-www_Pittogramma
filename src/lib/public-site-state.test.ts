import { describe, expect, test } from "bun:test";

import { getPublicSiteState } from "./public-site-state";

describe("public site state", () => {
  test("keeps the site live until a non-live mode has its required content", () => {
    expect(
      getPublicSiteState({
        countdown: { heading: "Coming soon" },
        publicSiteMode: "countdown",
      })
    ).toEqual({ mode: "live" });
  });

  test("resolves a configured countdown", () => {
    expect(
      getPublicSiteState({
        countdown: {
          heading: "Coming soon",
          launchAt: "2026-09-01T00:00:00+02:00",
          message: "A new version is on its way.",
        },
        publicSiteMode: "countdown",
      })
    ).toEqual({
      heading: "Coming soon",
      launchAt: "2026-09-01T00:00:00+02:00",
      message: "A new version is on its way.",
      mode: "countdown",
    });
  });

  test("releases the site when the countdown reaches its launch time", () => {
    expect(
      getPublicSiteState(
        {
          countdown: {
            heading: "Coming soon",
            launchAt: "2026-09-01T00:00:00+02:00",
          },
          publicSiteMode: "countdown",
        },
        { now: new Date("2026-09-01T00:00:00+02:00") }
      )
    ).toEqual({ mode: "live" });
  });

  test("resolves a configured maintenance page", () => {
    expect(
      getPublicSiteState({
        maintenance: {
          contactUrl: "https://pittogramma.xyz/contact",
          heading: "We will be back shortly.",
          message: "We are making a few changes.",
          returnAt: "2026-09-02T09:00:00+02:00",
        },
        publicSiteMode: "maintenance",
      })
    ).toEqual({
      contactUrl: "https://pittogramma.xyz/contact",
      heading: "We will be back shortly.",
      message: "We are making a few changes.",
      mode: "maintenance",
      returnAt: "2026-09-02T09:00:00+02:00",
    });
  });

  test("keeps preview deployments live when bypassed", () => {
    expect(
      getPublicSiteState(
        {
          maintenance: {
            heading: "Maintenance",
            message: "We are making changes.",
          },
          publicSiteMode: "maintenance",
        },
        { bypass: true }
      )
    ).toEqual({ mode: "live" });
  });
});
