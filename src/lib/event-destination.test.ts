import { describe, expect, test } from "bun:test";
import { buildExternalEventUrl } from "@/lib/event-destination";

describe("buildExternalEventUrl", () => {
  test("adds Pittogramma attribution without a campaign", () => {
    const result = new URL(
      buildExternalEventUrl("https://lu.ma/example", "summer-talk", {
        utmCampaign: "resources",
        utmMedium: "website",
        utmSource: "pittogramma",
      })
    );

    expect(result.searchParams.get("utm_source")).toBe("pittogramma");
    expect(result.searchParams.get("utm_medium")).toBe("website");
    expect(result.searchParams.get("utm_content")).toBe("summer-talk");
    expect(result.searchParams.has("utm_campaign")).toBe(false);
  });

  test("replaces managed parameters and preserves other parameters", () => {
    const result = new URL(
      buildExternalEventUrl(
        "https://events.example/register?ticket=vip&utm_source=old&utm_medium=email&utm_content=old&utm_campaign=summer",
        "new-event",
        { utmMedium: "website", utmSource: "pittogramma" }
      )
    );

    expect(result.searchParams.get("ticket")).toBe("vip");
    expect(result.searchParams.get("utm_source")).toBe("pittogramma");
    expect(result.searchParams.get("utm_medium")).toBe("website");
    expect(result.searchParams.get("utm_content")).toBe("new-event");
    expect(result.searchParams.get("utm_campaign")).toBe("summer");
  });
});
