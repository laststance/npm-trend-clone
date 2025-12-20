"use client";

import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";
import { MSWProvider } from "./msw-provider";
import { AuthProvider } from "@/contexts/auth-context";

/**
 * Root providers component that wraps the application with all necessary providers.
 * @param children - Child components to wrap with providers
 *
 * @description
 * Provider order (outermost to innermost):
 * 1. MSWProvider - Must be outermost to intercept requests before any data fetching
 * 2. NuqsAdapter - URL state management
 * 3. ThemeProvider - Theme context
 * 4. AuthProvider - Authentication context (demo mode)
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MSWProvider>
      <NuqsAdapter>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </MSWProvider>
  );
}
