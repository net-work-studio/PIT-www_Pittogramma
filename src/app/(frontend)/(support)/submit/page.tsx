import type { Metadata } from "next";
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
          data-fillout-inherit-parameters
        />
      </div>
      <Script
        src="https://server.fillout.com/embed/v1/"
        strategy="afterInteractive"
      />
    </>
  );
}
