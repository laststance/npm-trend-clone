"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";

/**
 * Root providers component that wraps the application with all necessary providers.
 * @param children - Child components to wrap with providers
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
