import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import AppLayout from "../components/AppLayout";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const SITE_URL = "https://www.novitaguok.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Novita | Engineer",
    template: "%s | Novita",
  },
  description:
    "Portfolio and journal of Novita (郭瑩慧) — an engineer writing about prompt engineering, software engineering, AI, and community events.",
  keywords: [
    "Novita",
    "engineer",
    "portfolio",
    "journal",
    "prompt engineering",
    "software engineering",
    "AI",
    "blog",
  ],
  authors: [{ name: "Novita (郭瑩慧)" }],
  creator: "Novita",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Novita",
    title: "Novita | Engineer",
    description:
      "Portfolio and journal of Novita (郭瑩慧) — an engineer writing about prompt engineering, software engineering, AI, and community events.",
  },
  twitter: {
    card: "summary",
    title: "Novita | Engineer",
    description:
      "Portfolio and journal of Novita (郭瑩慧) — an engineer writing about prompt engineering, software engineering, AI, and community events.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Fira+Code:wght@400;600&family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <Analytics />
      </body>
    </html>
  );
}
