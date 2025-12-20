"use client";

import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";

/**
 * Root providers component that wraps the application with all necessary providers.
 * @param children - Child components to wrap with providers
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider>{children}</ThemeProvider>
    </NuqsAdapter>
  );
}
