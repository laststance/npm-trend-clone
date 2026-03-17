"use client";

import { useReducer, useCallback, useRef } from "react";
import type { NpmPackage } from "@/types/package";

// ─────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────

/**
 * Popular packages shown when search input is focused but empty.
 * Sorted by typical download counts to show most popular first.
 */
export const POPULAR_PACKAGES = [
  "react",
  "vue",
  "angular",
  "svelte",
  "next",
  "typescript",
  "express",
  "lodash",
  "axios",
  "webpack",
];

/** Stable empty array to prevent unnecessary re-renders. */
export const EMPTY_PACKAGES: string[] = [];

// ─────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────

/**
 * Validates npm package name format.
 * @param name - Package name to validate
 * @returns Error message if invalid, null if valid
 * @see https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name
 * @example
 * validatePackageName("react")       // => null
 * validatePackageName(".bad")        // => "Package names cannot start with a dot or underscore"
 * validatePackageName("Has Spaces")  // => "Package names cannot contain spaces"
 */
function validatePackageName(name: string): string | null {
  if (!name || name.length < 1) {
    return null; // Empty is not an error, just no validation needed
  }

  // Check for invalid starting characters
  if (name.startsWith(".") || name.startsWith("_")) {
    return "Package names cannot start with a dot or underscore";
  }

  // Check for spaces
  if (/\s/.test(name)) {
    return "Package names cannot contain spaces";
  }

  // Check for uppercase (except in scoped packages after @)
  const nameWithoutScope = name.startsWith("@") ? name.split("/")[1] || "" : name;
  if (nameWithoutScope !== nameWithoutScope.toLowerCase()) {
    return "Package names must be lowercase";
  }

  // Check for invalid characters (allow @, /, -, _, .)
  if (!/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) {
    return "Package name contains invalid characters";
  }

  // Check maximum length
  if (name.length > 214) {
    return "Package name is too long (max 214 characters)";
  }

  return null;
}

// ─────────────────────────────────────────────────
// State & Actions
// ─────────────────────────────────────────────────

export interface SearchBarState {
  query: string;
  validationError: string | null;
  suggestions: NpmPackage[];
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;
  isOpen: boolean;
  selectedIndex: number;
  popularPackages: NpmPackage[];
  isLoadingPopular: boolean;
}

type SearchBarAction =
  | { type: "SET_QUERY"; query: string; validationError: string | null }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; suggestions: NpmPackage[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "SELECT_PACKAGE" }
  | { type: "OPEN_DROPDOWN" }
  | { type: "CLOSE_DROPDOWN" }
  | { type: "SET_SELECTED_INDEX"; index: number }
  | { type: "POPULAR_FETCH_START" }
  | { type: "POPULAR_FETCH_SUCCESS"; packages: NpmPackage[] };

const initialState: SearchBarState = {
  query: "",
  validationError: null,
  suggestions: [],
  isLoading: false,
  hasSearched: false,
  error: null,
  isOpen: false,
  selectedIndex: -1,
  popularPackages: [],
  isLoadingPopular: false,
};

/**
 * Pure reducer for SearchBar state transitions.
 * Each action represents an atomic state change that keeps all related fields consistent.
 * @param state - Current state
 * @param action - Action to apply
 * @returns Next state
 * @example
 * searchBarReducer(initialState, { type: "FETCH_START" })
 * // => { ...initialState, isLoading: true, error: null }
 */
export function searchBarReducer(
  state: SearchBarState,
  action: SearchBarAction,
): SearchBarState {
  switch (action.type) {
    case "SET_QUERY": {
      const base = {
        ...state,
        query: action.query,
        validationError: action.validationError,
        selectedIndex: -1,
      };
      if (action.validationError) {
        return { ...base, suggestions: [], isOpen: true, hasSearched: false };
      }
      return base;
    }
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        suggestions: action.suggestions,
        hasSearched: true,
        isOpen: true,
        isLoading: false,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        suggestions: [],
        hasSearched: true,
        error: action.error,
        isOpen: true,
        isLoading: false,
      };
    case "SELECT_PACKAGE":
      return {
        ...state,
        query: "",
        suggestions: [],
        isOpen: false,
        selectedIndex: -1,
      };
    case "OPEN_DROPDOWN":
      return { ...state, isOpen: true };
    case "CLOSE_DROPDOWN":
      return { ...state, isOpen: false, selectedIndex: -1 };
    case "SET_SELECTED_INDEX":
      return { ...state, selectedIndex: action.index };
    case "POPULAR_FETCH_START":
      return { ...state, isLoadingPopular: true };
    case "POPULAR_FETCH_SUCCESS":
      return {
        ...state,
        popularPackages: action.packages,
        isLoadingPopular: false,
      };
  }
}

// ─────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────

interface UseSearchBarOptions {
  /** Callback when a package is selected */
  onSelectPackage: (packageName: string) => void;
  /** Already selected package names to exclude from suggestions */
  selectedPackages: string[];
}

/**
 * Custom hook encapsulating all SearchBar state management and data fetching.
 * Uses useReducer for atomic state transitions across 10 related state fields.
 * @param options - Hook configuration
 * @returns State object and handler functions for the SearchBar component
 * @example
 * const { state, handleInputChange, handleSelect, handleKeyDown } = useSearchBar({
 *   onSelectPackage: (name) => addPackage(name),
 *   selectedPackages: ["react", "vue"],
 * });
 */
export function useSearchBar({ onSelectPackage, selectedPackages }: UseSearchBarOptions) {
  const [state, dispatch] = useReducer(searchBarReducer, initialState);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const popularFetchedRef = useRef(false);

  /**
   * Fetches weekly download counts for multiple packages in parallel.
   * @param packageNames - Array of package names
   * @returns Map of package name to download count
   */
  const fetchDownloadCounts = useCallback(
    async (packageNames: string[]): Promise<Map<string, number>> => {
      const downloadMap = new Map<string, number>();
      if (packageNames.length === 0) return downloadMap;

      const fetchPromises = packageNames.map(async (name) => {
        try {
          const response = await fetch(
            `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`,
          );
          if (!response.ok) return null;
          const data = await response.json();
          if (data.downloads !== undefined) {
            return { name, downloads: data.downloads as number };
          }
        } catch {
          // Silently fail for individual packages
        }
        return null;
      });

      const results = await Promise.all(fetchPromises);
      for (const result of results) {
        if (result) {
          downloadMap.set(result.name, result.downloads);
        }
      }

      return downloadMap;
    },
    [],
  );

  /**
   * Fetches popular packages with download counts. Only fetches once per mount.
   */
  const fetchPopularPackages = useCallback(async () => {
    if (popularFetchedRef.current || state.popularPackages.length > 0) {
      return;
    }

    dispatch({ type: "POPULAR_FETCH_START" });
    popularFetchedRef.current = true;

    try {
      const availablePackages = POPULAR_PACKAGES.filter(
        (name) => !selectedPackages.includes(name),
      );

      if (availablePackages.length === 0) {
        dispatch({ type: "POPULAR_FETCH_SUCCESS", packages: [] });
        return;
      }

      const downloadCounts = await fetchDownloadCounts(availablePackages);

      const packagesWithDownloads: NpmPackage[] = availablePackages
        .map((name) => ({
          name,
          description: "Popular package",
          weeklyDownloads: downloadCounts.get(name),
        }))
        .sort((a, b) => (b.weeklyDownloads ?? 0) - (a.weeklyDownloads ?? 0));

      dispatch({ type: "POPULAR_FETCH_SUCCESS", packages: packagesWithDownloads });
    } catch {
      dispatch({ type: "POPULAR_FETCH_SUCCESS", packages: [] });
    }
  }, [selectedPackages, fetchDownloadCounts, state.popularPackages.length]);

  /**
   * Fetches package suggestions from npm registry.
   */
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        dispatch({ type: "FETCH_SUCCESS", suggestions: [] });
        return;
      }

      dispatch({ type: "FETCH_START" });
      try {
        const response = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(searchQuery)}&size=10`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        const packages: NpmPackage[] = data.objects.map(
          (obj: { package: NpmPackage }) => ({
            name: obj.package.name,
            description: obj.package.description,
            version: obj.package.version,
          }),
        );
        const filteredPackages = packages.filter(
          (pkg) => !selectedPackages.includes(pkg.name),
        );

        const packageNames = filteredPackages.map((pkg) => pkg.name);
        const downloadCounts = await fetchDownloadCounts(packageNames);

        const packagesWithDownloads = filteredPackages.map((pkg) => ({
          ...pkg,
          weeklyDownloads: downloadCounts.get(pkg.name),
        }));

        dispatch({ type: "FETCH_SUCCESS", suggestions: packagesWithDownloads });
      } catch {
        dispatch({
          type: "FETCH_ERROR",
          error: "Failed to search packages. Please try again.",
        });
      }
    },
    [selectedPackages, fetchDownloadCounts],
  );

  /**
   * Handles input value changes with debounced search and validation.
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const validationErr = validatePackageName(value);

      dispatch({ type: "SET_QUERY", query: value, validationError: validationErr });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!validationErr) {
        debounceRef.current = setTimeout(() => {
          fetchSuggestions(value);
        }, 300);
      }
    },
    [fetchSuggestions],
  );

  /**
   * Handles package selection — resets search state and notifies parent.
   */
  const handleSelect = useCallback(
    (packageName: string) => {
      onSelectPackage(packageName);
      dispatch({ type: "SELECT_PACKAGE" });
    },
    [onSelectPackage],
  );

  /**
   * Handles keyboard navigation for both suggestion and popular package lists.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const filteredPopular = state.popularPackages.filter(
        (pkg) => !selectedPackages.includes(pkg.name),
      );
      const activeList = state.query.length === 0 ? filteredPopular : state.suggestions;

      if (!state.isOpen || activeList.length === 0) {
        if (e.key === "Escape") {
          dispatch({ type: "CLOSE_DROPDOWN" });
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          dispatch({
            type: "SET_SELECTED_INDEX",
            index: state.selectedIndex < activeList.length - 1
              ? state.selectedIndex + 1
              : state.selectedIndex,
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          dispatch({
            type: "SET_SELECTED_INDEX",
            index: state.selectedIndex > 0 ? state.selectedIndex - 1 : -1,
          });
          break;
        case "Enter":
          e.preventDefault();
          if (state.selectedIndex >= 0 && activeList[state.selectedIndex]) {
            handleSelect(activeList[state.selectedIndex].name);
          }
          break;
        case "Escape":
          dispatch({ type: "CLOSE_DROPDOWN" });
          break;
      }
    },
    [state, selectedPackages, handleSelect],
  );

  const openDropdown = useCallback(() => {
    dispatch({ type: "OPEN_DROPDOWN" });
  }, []);

  const closeDropdown = useCallback(() => {
    dispatch({ type: "CLOSE_DROPDOWN" });
  }, []);

  const setSelectedIndex = useCallback((index: number) => {
    dispatch({ type: "SET_SELECTED_INDEX", index });
  }, []);

  return {
    state,
    handleInputChange,
    handleSelect,
    handleKeyDown,
    fetchPopularPackages,
    openDropdown,
    closeDropdown,
    setSelectedIndex,
  };
}
