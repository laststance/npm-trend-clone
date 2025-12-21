"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ChartDataPoint, TimeRange } from "@/types/package";

/**
 * Custom error class for rate limit responses.
 * Contains the retry-after duration in seconds.
 */
class RateLimitError extends Error {
  retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

/**
 * API response structure for download data.
 */
interface DownloadData {
  [packageName: string]:
    | { downloads: Array<{ day: string; downloads: number }> }
    | { error: string };
}

/**
 * Aggregates daily downloads into weekly data points.
 * @param downloads - Array of daily download data
 * @returns Aggregated weekly totals
 */
function aggregateWeekly(
  downloads: Array<{ day: string; downloads: number }>
): Array<{ day: string; downloads: number }> {
  const weeklyData: Array<{ day: string; downloads: number }> = [];
  let weekTotal = 0;
  let weekStart = "";

  for (let i = 0; i < downloads.length; i++) {
    if (i % 7 === 0) {
      if (weekStart) {
        weeklyData.push({ day: weekStart, downloads: weekTotal });
      }
      weekStart = downloads[i].day;
      weekTotal = downloads[i].downloads;
    } else {
      weekTotal += downloads[i].downloads;
    }
  }

  // Push the last week
  if (weekStart) {
    weeklyData.push({ day: weekStart, downloads: weekTotal });
  }

  return weeklyData;
}

/**
 * Custom hook for fetching and managing package download data.
 * Uses a stable string key to prevent infinite re-renders from array reference changes.
 * @param packageNames - Array of package names to fetch
 * @param timeRange - Time range for the data
 * @returns
 * - data: Chart data points
 * - isLoading: Loading state
 * - error: Error message if request failed
 * - invalidPackages: Array of package names that returned errors
 * - refetch: Function to trigger re-fetch
 * @example
 * const { data, isLoading, error, invalidPackages } = useDownloads(['react', 'vue'], '1y');
 */
export function useDownloads(packageNames: string[], timeRange: TimeRange) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidPackages, setInvalidPackages] = useState<string[]>([]);
  const [refetchCount, setRefetchCount] = useState(0);

  // Use a stable string key to prevent infinite re-renders
  const packagesKey = packageNames.join(",");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if still in flight
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!packagesKey) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Track whether abort was caused by timeout
    let isTimeout = false;

    // Timeout after 30 seconds
    const timeoutId = setTimeout(() => {
      isTimeout = true;
      controller.abort();
    }, 30000);

    /**
     * Fetch with automatic retry and exponential backoff.
     * @param url - URL to fetch
     * @param options - Fetch options
     * @param retries - Number of retries remaining
     * @param delay - Current delay in ms
     */
    async function fetchWithRetry(
      url: string,
      options: RequestInit,
      retries = 3,
      delay = 1000
    ): Promise<Response> {
      try {
        const response = await fetch(url, options);

        // Handle rate limiting - don't retry, show wait time to user
        if (response.status === 429) {
          const retryAfterHeader = response.headers.get("Retry-After");
          let retryAfter = 10; // Default fallback

          // Try to get retryAfter from response body
          try {
            const errorBody = await response.json();
            if (typeof errorBody.retryAfter === "number") {
              retryAfter = errorBody.retryAfter;
            }
          } catch {
            // If body parsing fails, use header value
            if (retryAfterHeader) {
              retryAfter = parseInt(retryAfterHeader, 10) || 10;
            }
          }

          throw new RateLimitError(retryAfter);
        }

        if (!response.ok) {
          throw new Error("Failed to fetch download data");
        }
        return response;
      } catch (err) {
        // Don't retry on abort, rate limit, or when no retries left
        if (
          retries <= 0 ||
          (err instanceof Error && err.name === "AbortError") ||
          err instanceof RateLimitError
        ) {
          throw err;
        }
        // Wait with exponential backoff and retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    }

    const fetchDownloads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithRetry(
          `/api/downloads?packages=${packagesKey}&range=${timeRange}`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        const downloadData: DownloadData = await response.json();

        // Collect all unique dates
        const dateSet = new Set<string>();
        const packageDownloads: Record<string, Map<string, number>> = {};
        const invalidPkgs: string[] = [];

        for (const [pkgName, pkgData] of Object.entries(downloadData)) {
          if ("error" in pkgData) {
            console.warn(`Error fetching ${pkgName}: ${pkgData.error}`);
            invalidPkgs.push(pkgName);
            continue;
          }

          // Aggregate to weekly data for cleaner charts
          const weeklyData = aggregateWeekly(pkgData.downloads);
          packageDownloads[pkgName] = new Map();

          for (const { day, downloads } of weeklyData) {
            dateSet.add(day);
            packageDownloads[pkgName].set(day, downloads);
          }
        }

        // Sort dates and build chart data
        const sortedDates = Array.from(dateSet).sort();
        const chartData: ChartDataPoint[] = sortedDates.map((date) => {
          const point: ChartDataPoint = { date };
          for (const [pkgName, downloads] of Object.entries(packageDownloads)) {
            point[pkgName] = downloads.get(date) || 0;
          }
          return point;
        });

        setData(chartData);
        setInvalidPackages(invalidPkgs);
      } catch (err) {
        // Handle timeout vs user abort
        if (err instanceof Error && err.name === "AbortError") {
          if (isTimeout) {
            // Timeout-initiated abort - show user-friendly message
            setError("Request timed out. The server took too long to respond.");
            setData([]);
          }
          // User-initiated abort (component unmount, etc.) - ignore silently
          return;
        }

        // Handle rate limiting with user-friendly toast
        if (err instanceof RateLimitError) {
          const waitTime = err.retryAfter;
          toast.error("Rate limit exceeded", {
            description: `Too many requests. Please wait ${waitTime} seconds before trying again.`,
            duration: Math.min(waitTime * 1000, 10000), // Show for wait time, max 10s
          });
          setError(`Rate limited. Please wait ${waitTime} seconds.`);
          setData([]);
          return;
        }

        console.error("Error fetching downloads:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloads();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [packagesKey, timeRange, refetchCount]);

  const refetch = () => {
    // Trigger re-fetch by incrementing counter to force useEffect re-run
    setRefetchCount((c) => c + 1);
  };

  return { data, isLoading, error, invalidPackages, refetch };
}
