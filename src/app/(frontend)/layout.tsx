import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { draftMode } from "next/headers";
import { connection } from "next/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";

import { DisableDraftMode } from "@/components/disable-draft-mode";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { PublicHoldingPage } from "@/components/shared/public-holding-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getPublicSiteState } from "@/lib/public-site-state";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  SanityLive,
  sanityFetch,
} from "@/sanity/lib/live";
import { PUBLIC_SITE_STATE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const settings = await getCachedPublicSiteSettings({
    perspective: "published",
    stega: false,
  });
  const state = getPublicSiteState(settings, {
    bypass: process.env.PUBLIC_SITE_MODE_BYPASS === "true",
  });

  if (state.mode === "live") {
    return {};
  }

  return {
    robots: { follow: false, index: false },
    title: state.heading,
  };
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <Suspense fallback={<PublicSiteFallback />}>
        <FrontendContent>{children}</FrontendContent>
      </Suspense>
    </ThemeProvider>
  );
}

async function FrontendContent({ children }: { children: React.ReactNode }) {
  await connection();
  const { isEnabled: isDraftMode } = await draftMode();
  const { perspective, stega } = isDraftMode
    ? await getDynamicFetchOptions()
    : { perspective: "published" as const, stega: false };
  const settings = await getCachedPublicSiteSettings({ perspective, stega });
  const state = getPublicSiteState(settings, {
    bypass: process.env.PUBLIC_SITE_MODE_BYPASS === "true",
  });
  const isLive = state.mode === "live";

  return (
    <>
      {isLive ? (
        <div className="flex min-h-dvh flex-col">
          {isDraftMode ? (
            <Suspense fallback={<HeaderFallback />}>
              <DynamicHeader />
            </Suspense>
          ) : (
            <Header perspective="published" stega={false} />
          )}
          <main className="mt-14 flex flex-1 flex-col px-5">{children}</main>
          {isDraftMode ? (
            <Suspense fallback={<FooterFallback />}>
              <DynamicFooter />
            </Suspense>
          ) : (
            <Footer perspective="published" stega={false} />
          )}
        </div>
      ) : (
        <PublicHoldingPage state={state} />
      )}
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode ? (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      ) : null}
    </>
  );
}

async function getCachedPublicSiteSettings({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  // Public-site mode is a small operational setting. It must take effect
  // without depending on a visitor already having Sanity Live connected.
  cacheLife({ expire: 60, revalidate: 10, stale: 0 });
  const { data: settings } = await sanityFetch({
    perspective,
    query: PUBLIC_SITE_STATE_QUERY,
    stega,
  });
  return settings;
}

async function DynamicHeader() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <Header perspective={perspective} stega={stega} />;
}

async function DynamicFooter() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <Footer perspective={perspective} stega={stega} />;
}

function HeaderFallback() {
  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex w-full flex-row items-center justify-between border-border border-b bg-background px-4 py-2.5">
      <div className="h-6 w-6" />
    </header>
  );
}

function FooterFallback() {
  return (
    <footer className="p-4">
      <div className="rounded-lg bg-secondary p-4" />
    </footer>
  );
}

function PublicSiteFallback() {
  return <div className="min-h-dvh bg-background" />;
}
