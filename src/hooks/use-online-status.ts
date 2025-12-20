"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to track online/offline status.
 * Uses the browser's navigator.onLine and online/offline events.
 * @returns Current online status (true = online, false = offline)
 * @example
 * const isOnline = useOnlineStatus();
 * if (!isOnline) {
 *   return <OfflineBanner />;
 * }
 */
export function useOnlineStatus(): boolean {
  // Initialize with navigator.onLine, defaulting to true for SSR
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
