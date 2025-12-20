"use client";

import { useState, useEffect, useRef } from "react";
import type { PackageInfo } from "@/types/package";

/**
 * API response structure for package info.
 */
type PackageInfoResponse = Record<string, PackageInfo | { error: string }>;

/**
 * Custom hook for fetching package metadata.
 * @param packageNames - Array of package names to fetch info for
 * @returns
 * - data: Map of package name to PackageInfo
 * - isLoading: Loading state
 * - error: Error message if request failed
 * @example
 * const { data, isLoading, error } = usePackageInfo(['react', 'vue']);
 * // data = { react: { name: 'react', ... }, vue: { name: 'vue', ... } }
 */
export function usePackageInfo(packageNames: string[]) {
  const [data, setData] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use stable string key to prevent infinite re-renders
  const packagesKey = packageNames.join(",");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if still in flight
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!packagesKey) {
      setData({});
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchPackageInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/packages/info?packages=${packagesKey}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch package info");
        }

        const responseData: PackageInfoResponse = await response.json();

        // Filter out error responses
        const validData: Record<string, PackageInfo> = {};
        for (const [name, info] of Object.entries(responseData)) {
          if (!("error" in info)) {
            validData[name] = info;
          }
        }

        setData(validData);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Error fetching package info:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageInfo();

    return () => {
      controller.abort();
    };
  }, [packagesKey]);

  return { data, isLoading, error };
}
