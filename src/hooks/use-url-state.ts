"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useCallback, useMemo } from "react";
import { getChartColor } from "@/constants/colors";
import type { SelectedPackage, TimeRange } from "@/types/package";

/**
 * Parses comma-separated package names from URL.
 */
const packagesParser = parseAsArrayOf(parseAsString, ",").withDefault([]);

/**
 * Parses time range from URL.
 */
const timeRangeParser = parseAsString.withDefault("1y");

/**
 * Custom hook for managing URL state with nuqs.
 * Synchronizes package selection and time range with URL parameters.
 * @returns URL state and setter functions
 */
export function useUrlState() {
  const [packagesParam, setPackagesParam] = useQueryState(
    "packages",
    packagesParser
  );
  const [timeRangeParam, setTimeRangeParam] = useQueryState(
    "range",
    timeRangeParser
  );

  /**
   * Convert package names to SelectedPackage objects with colors.
   */
  const selectedPackages: SelectedPackage[] = useMemo(() => {
    return packagesParam.map((name, index) => ({
      name,
      color: getChartColor(index),
    }));
  }, [packagesParam]);

  /**
   * Current time range.
   */
  const timeRange = timeRangeParam as TimeRange;

  /**
   * Adds a package to the selection.
   */
  const addPackage = useCallback(
    async (packageName: string) => {
      if (packagesParam.includes(packageName)) return;
      await setPackagesParam([...packagesParam, packageName]);
    },
    [packagesParam, setPackagesParam]
  );

  /**
   * Removes a package from the selection.
   */
  const removePackage = useCallback(
    async (packageName: string) => {
      await setPackagesParam(packagesParam.filter((p) => p !== packageName));
    },
    [packagesParam, setPackagesParam]
  );

  /**
   * Sets the time range.
   */
  const setTimeRange = useCallback(
    async (range: TimeRange) => {
      await setTimeRangeParam(range);
    },
    [setTimeRangeParam]
  );

  /**
   * Clears all packages.
   */
  const clearPackages = useCallback(async () => {
    await setPackagesParam([]);
  }, [setPackagesParam]);

  /**
   * Sets all packages (replaces current selection).
   * @param packages - Array of package names to set
   */
  const setPackages = useCallback(
    async (packages: string[]) => {
      await setPackagesParam(packages);
    },
    [setPackagesParam]
  );

  return {
    selectedPackages,
    timeRange,
    addPackage,
    removePackage,
    setTimeRange,
    clearPackages,
    setPackages,
    packageNames: packagesParam,
  };
}
