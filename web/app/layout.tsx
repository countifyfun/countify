import { cn } from "@/lib/cn";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
});

const whitney = localFont({
  src: [
    {
      path: "./Whitney-Book.woff",
      weight: "400",
    },
    {
      path: "./Whitney-Medium.woff",
      weight: "500",
    },
    {
      path: "./Whitney-Semibold.woff",
      weight: "600",
    },
  ],
  display: "swap",
  variable: "--font-whitney",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://countify.fun"),
  title: {
    default: "Countify",
    template: "%s — Countify",
  },
  description: "Your dream Discord counting bot.",
  twitter: {
    card: "summary_large_image",
    creator: "@ToastedDev",
    creatorId: "1145171094556426240",
  },
  openGraph: {
    type: "website",
    url: "/",
    images: [
      {
        url: "https://countify.fun/og.jpg",
      },
    ],
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(inter.className, whitney.variable)}
      suppressHydrationWarning
    >
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
