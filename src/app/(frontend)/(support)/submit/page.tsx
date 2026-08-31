import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Submit your project",
};

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
