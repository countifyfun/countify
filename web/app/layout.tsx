import { cn } from "@/lib/cn";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";

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
