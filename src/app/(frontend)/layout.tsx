import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import { SanityLive } from "@/sanity/lib/live";
import { refreshAction } from "@/sanity/lib/refresh-action";

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <Header />
      <main className="mt-14 mb-auto px-5">{children}</main>
      {isDraftMode ? <SanityLive revalidateSyncTags={refreshAction} /> : null}
      {isDraftMode ? (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      ) : null}
      <Footer />
    </ThemeProvider>
  );
}
