import { Button } from "@/components/ui/button";
import { type DynamicFetchOptions, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function JournalArticleCta({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    perspective,
    stega,
  });

  const substackUrl = settings?.substackUrl;

  if (!substackUrl) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[700px] rounded-lg bg-foreground p-6 text-background">
      <p className="font-mono text-[10px] uppercase">Newsletter</p>
      <p className="mt-2 text-base lg:text-lg">
        Do you want to be updated on next articles?
      </p>
      <Button
        className="mt-4 rounded-full font-mono uppercase"
        render={
          // biome-ignore lint/a11y/useAnchorContent: Base UI injects the Button children into this render element.
          <a href={substackUrl} rel="noopener noreferrer" target="_blank" />
        }
        variant="outline"
      >
        Subscribe to our newsletter
      </Button>
    </div>
  );
}
