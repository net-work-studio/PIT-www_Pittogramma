import type { Metadata } from "next";
import localFont from "next/font/local";

import SiteSchema from "@/components/seo/site-schema";
import { siteDefaults } from "@/lib/seo/site-defaults";

import "./globals.css";

const sono = localFont({
  preload: true,
  src: [
    {
      path: "../fonts/OTSonoMono-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/OTSonoMono-RegularItalic.woff2",
      style: "italic",
      weight: "400",
    },
  ],
  variable: "--font-sono",
});

const aktual = localFont({
  preload: true,
  src: [
    {
      path: "../fonts/FTAktual-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/FTAktual-RegularItalic.woff2",
      style: "italic",
      weight: "400",
    },
  ],
  variable: "--font-aktual",
});

export const metadata: Metadata = {
  appleWebApp: {
    title: "Pittogramma",
  },
  description: siteDefaults.description,
  metadataBase: new URL(siteDefaults.baseUrl),
  openGraph: {
    locale: "en_US",
    siteName: siteDefaults.title || "Pittogramma",
    type: "website",
  },
  title: {
    default: siteDefaults.title || "Pittogramma",
    template: "%s – Pittogramma",
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
    <html
      className={`${aktual.variable} ${sono.variable} bg-background`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col justify-between bg-background text-foreground antialiased">
        <SiteSchema />
        {children}
      </body>
    </html>
  );
}
