import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { staticPageMetadata } from "@/lib/seo/static-page-metadata";

export const metadata: Metadata = staticPageMetadata(
  "/newsletter-confirmed",
  "Newsletter subscription confirmed",
  "Your Pittogramma newsletter subscription has been confirmed."
);

export default function NewsletterConfirmedPage() {
  return (
    <>
      <PageHeader title="Newsletter subscription confirmed" />
      <section className="mx-auto flex w-full max-w-prose flex-col items-center gap-6 px-4 pb-16 text-center">
        <p className="text-balance text-lg text-muted-foreground">
          Thank you for confirming your subscription. You&apos;ll receive future
          Pittogramma updates in your inbox.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/journal" />}
          variant="mono"
        >
          Explore the journal
        </Button>
      </section>
    </>
  );
}
