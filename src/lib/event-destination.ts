import type { UtmSettings } from "@/lib/tracked-link";

export function buildExternalEventUrl(
  destination: string,
  slug: string,
  settings?: UtmSettings
): string {
  try {
    const url = new URL(destination);

    const source = settings?.utmSource ?? "pittogramma";
    const medium = settings?.utmMedium ?? "website";

    if (source) {
      url.searchParams.set("utm_source", source);
    }
    if (medium) {
      url.searchParams.set("utm_medium", medium);
    }
    url.searchParams.set("utm_content", slug);

    return url.toString();
  } catch {
    return destination;
  }
}
