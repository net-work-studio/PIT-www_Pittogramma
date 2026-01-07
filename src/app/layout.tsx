import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";
import { siteDefaults } from "@/lib/seo/siteDefaults";

const sono = localFont({
  src: [
    {
      path: "../fonts/OTSonoMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/OTSonoMono-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  preload: true,
  variable: "--font-sono",
});

const aktual = localFont({
  src: [
    {
      path: "../fonts/FTAktual-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/FTAktual-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  preload: true,
  variable: "--font-aktual",
});

export const metadata: Metadata = {
  title: {
    default: siteDefaults.title || "Pittogramma",
    template: "%s – Pittogramma",
  },
  description: siteDefaults.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteDefaults.title || "Pittogramma",
    // Default OG image can be added here
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-background" lang="en" suppressHydrationWarning>
      <body
        className={`${aktual.variable} ${sono.variable} flex min-h-screen flex-col justify-between bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
