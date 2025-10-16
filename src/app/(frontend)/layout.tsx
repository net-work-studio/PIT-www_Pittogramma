import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import { SanityLive } from "@/sanity/lib/live";

export default function FrontendLayout({
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
      <Header />
      <main className="mt-14 mb-auto px-5">
        {children}
        <SanityLive />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
