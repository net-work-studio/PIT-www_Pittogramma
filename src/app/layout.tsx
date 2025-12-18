import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Pittogramma",
  description:
    "Pittogramma is a platform for sharing projects designed by young designers, resources, events and experiences from the world graphic design scene",
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
