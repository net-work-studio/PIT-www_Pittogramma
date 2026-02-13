import { Button } from "@/components/ui/button";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function JournalArticleCta() {
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
  });

  const substackUrl = settings?.substackUrl;

  return (
    <div className="mx-auto max-w-[700px] rounded-lg bg-foreground p-6 text-background">
      <p className="font-mono text-[10px] uppercase">Newsletter</p>
      <p className="mt-2 text-base lg:text-lg">
        Do you want to be updated on next articles?
      </p>
      <Button
        asChild
        className="mt-4 rounded-full font-mono uppercase"
        variant="outline"
      >
        <a href={substackUrl ?? "#"} rel="noopener noreferrer" target="_blank">
          Subscribe to our newsletter
        </a>
      </Button>
    </div>
  );
}
