"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { isMSWEnabled } from "@/utils/isMSWEnabled";

/**
 * MSWProvider - Wrapper component managing MSW initialization.
 *
 * @description
 * Key implementation points:
 * - 'use client' declares this as a client-only component
 * - useLayoutEffect initializes MSW before first paint
 * - Dynamic import prevents server bundle contamination
 * - State-based blocking prevents race conditions
 *
 * @param children - Child components to render after MSW initialization
 *
 * @example
 * <MSWProvider>
 *   <App />
 * </MSWProvider>
 */
export function MSWProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  const [isMSWReady, setIsMSWReady] = useState(false);

  useLayoutEffect(() => {
    const enabled = isMSWEnabled();

    // Skip if MSW disabled or in SSR context
    if (!enabled || typeof window === "undefined") {
      setIsMSWReady(true);
      return;
    }

    // Dynamic import: Separates browser-only code from server bundle
    import("../../../mocks/browser")
      .then(async ({ worker }) => {
        try {
          await worker.start({
            onUnhandledRequest: "bypass", // Non-mocked requests pass through
          });
          setIsMSWReady(true);
        } catch {
          // App continues even if MSW fails to start
          console.warn("[MSW] Failed to start worker");
          setIsMSWReady(true);
        }
      })
      .catch(() => {
        console.warn("[MSW] Failed to load browser module");
        setIsMSWReady(true);
      });
  }, []);

  // Show loading while MSW initializes
  // This prevents components from fetching before MSW is ready
  if (isMSWEnabled() && !isMSWReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Initializing MSW...</p>
      </div>
    );
  }

  return <>{children}</>;
}
