"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

/**
 * Displays a banner when the user is offline.
 * Automatically shows/hides based on network status.
 *
 * @example
 * // Add to layout or root component
 * <OfflineIndicator />
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950"
      role="alert"
      aria-live="assertive"
      data-testid="offline-indicator"
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        <span>You are currently offline. Some features may be unavailable.</span>
      </div>
    </div>
  );
}
