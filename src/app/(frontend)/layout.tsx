import { draftMode } from "next/headers";
import { connection } from "next/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";

import { DisableDraftMode } from "@/components/disable-draft-mode";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import { buildLocalToday } from "@/lib/date-utils";
import { getDynamicFetchOptions, SanityLive } from "@/sanity/lib/live";

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <Suspense fallback={<HeaderFallback />}>
        {isDraftMode ? <DynamicHeader /> : <PublishedHeader />}
      </Suspense>
      <main className="mt-14 mb-auto px-5">{children}</main>
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      {isDraftMode ? (
        <Suspense fallback={<FooterFallback />}>
          <DynamicFooter />
        </Suspense>
      ) : (
        <Footer perspective="published" stega={false} />
      )}
    </ThemeProvider>
  );
}

async function PublishedHeader() {
  await connection();
  return (
    <Header perspective="published" stega={false} today={buildLocalToday()} />
  );
}

async function DynamicHeader() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <Header perspective={perspective} stega={stega} today={buildLocalToday()} />;
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
