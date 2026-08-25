import Link from "next/link";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <div className="flex min-h-dvh flex-col">
        <Header perspective="published" stega={false} />
        <main className="mt-14 flex flex-1 items-center justify-center px-5">
          <div className="flex flex-col items-center gap-8 text-center">
            <hgroup className="flex flex-col gap-2">
              <p className="font-mono text-muted-foreground text-sm">404</p>
              <h1 className="text-2xl uppercase">Page not found</h1>
              <p className="max-w-prose text-balance text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
              </p>
            </hgroup>
            <Button nativeButton={false} render={<Link href="/" />}>
              Back to home
            </Button>
          </div>
        </main>
        <Footer perspective="published" stega={false} />
      </div>
    </ThemeProvider>
  );
}
