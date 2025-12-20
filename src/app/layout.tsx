import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { isMSWEnabled } from "@/utils/isMSWEnabled";
import "./globals.css";

/**
 * Server-side MSW initialization.
 * Only runs in Node.js runtime (not Edge) when MSW is enabled.
 *
 * Important: Uses require() instead of import for synchronous top-level execution
 */
if (process.env.NEXT_RUNTIME === "nodejs" && isMSWEnabled()) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { server } = require("../../mocks/server");
  server.listen({ onUnhandledRequest: "bypass" });
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "npm trends - Compare npm package downloads",
  description:
    "Compare npm package download statistics over time. Find the best packages for your project.",
  keywords: ["npm", "trends", "packages", "downloads", "statistics", "compare"],
  openGraph: {
    title: "npm trends - Compare npm package downloads",
    description: "Compare npm package download statistics over time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
        {/*
          Aria-live region wrapper for toast announcements.
          Sonner toasts are announced to screen readers via this wrapper.
        */}
        <div aria-live="polite" aria-atomic="true">
          <Toaster richColors position="bottom-center" duration={4000} />
        </div>
      </body>
    </html>
  );
}
