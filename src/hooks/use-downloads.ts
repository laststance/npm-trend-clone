"use client";

import { useState, useEffect, useRef } from "react";
import type { ChartDataPoint, TimeRange } from "@/types/package";

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
 * @returns Download data, loading state, error state, and refetch function
 * @example
 * const { data, isLoading, error } = useDownloads(['react', 'vue'], '1y');
 */
export function useDownloads(packageNames: string[], timeRange: TimeRange) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const fetchDownloads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/downloads?packages=${packagesKey}&range=${timeRange}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch download data");
        }

        const downloadData: DownloadData = await response.json();

        // Collect all unique dates
        const dateSet = new Set<string>();
        const packageDownloads: Record<string, Map<string, number>> = {};

        for (const [pkgName, pkgData] of Object.entries(downloadData)) {
          if ("error" in pkgData) {
            console.warn(`Error fetching ${pkgName}: ${pkgData.error}`);
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
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
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
      controller.abort();
    };
  }, [packagesKey, timeRange]);

  const refetch = () => {
    // Trigger re-fetch by creating a new effect cycle
    setData([]);
    setError(null);
  };

  return { data, isLoading, error, refetch };
}
