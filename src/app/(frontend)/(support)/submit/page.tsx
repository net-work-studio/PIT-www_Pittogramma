import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { staticPageMetadata } from "@/lib/seo/static-page-metadata";

export const metadata: Metadata = staticPageMetadata(
  "/submit",
  "Submit your project",
  "Submit an emerging graphic design project to Pittogramma."
);

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Submit your project</h1>
      <div className="h-[calc(100svh-3.5rem)] min-h-[32rem] w-full">
        <div
          className="size-full"
          data-fillout-embed-type="fullscreen"
          data-fillout-id="jyMdNbBqwRus"
        />
      </div>
      <p className="px-4 pb-4 text-center text-muted-foreground text-sm">
        Read the{" "}
        <Link className="underline" href="/submission-terms">
          Project Submission Terms
        </Link>
        .
      </p>
      <Script
        src="https://server.fillout.com/embed/v1/"
        strategy="afterInteractive"
      />
    </>
  );
}
