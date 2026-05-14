import { syncTagInvalidateEventHandler } from "@sanity/functions";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const handler = syncTagInvalidateEventHandler(
  async ({ context, event, done }) => {
    const syncTags =
      Array.isArray(event.data.syncTags) && event.data.syncTags.length > 0
        ? event.data.syncTags
        : [];

    if (syncTags.length === 0) {
      if (context.local) {
        syncTags.push("sanity:function-local-test");
      } else {
        throw new Error("No sync tags received");
      }
    }

    const siteUrl = requiredEnv("NEXT_SITE_URL");
    const secret = requiredEnv("SANITY_REVALIDATE_SECRET");
    const endpoint = new URL("/api/expire-tags", siteUrl);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ syncTags }),
    });

    if (!response.ok) {
      const body = await response.text();
      // biome-ignore lint/suspicious/noConsole: Sanity Functions expose operational logs through console.
      console.error("Failed to invalidate Next cache tags", {
        status: response.status,
        body,
        syncTags,
      });
      throw new Error(`Next cache invalidation failed: ${response.status}`);
    }

    const doneResponse = await done(syncTags);
    if (!doneResponse.ok) {
      throw new Error(
        `Sanity sync tag completion failed: ${doneResponse.status}`
      );
    }

    // biome-ignore lint/suspicious/noConsole: Sanity Functions expose operational logs through console.
    console.log(`Invalidated ${syncTags.length} sync tags`);
  }
);
