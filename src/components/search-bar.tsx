"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Loader2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NpmPackage } from "@/types/package";

/**
 * Popular packages shown when search input is focused but empty.
 * Sorted by typical download counts to show most popular first.
 */
const POPULAR_PACKAGES = [
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

/**
 * Validates npm package name format.
 * @param name - Package name to validate
 * @returns Error message if invalid, null if valid
 * @see https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name
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

/**
 * Formats a number to a human-readable string (e.g., 1500000 -> "1.5M").
 * @param num - The number to format
 * @returns Formatted string with K/M/B suffix
 */
function formatDownloads(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

interface SearchBarProps {
  /** Callback when a package is selected */
  onSelectPackage: (packageName: string) => void;
  /** Already selected package names to exclude from suggestions */
  selectedPackages?: string[];
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Search bar with autocomplete for npm packages.
 * Implements debounced search with dropdown suggestions.
 * @param onSelectPackage - Callback when a package is selected
 * @param disabled - Whether the search is disabled
 * @param placeholder - Placeholder text for the input
 */
export function SearchBar({
  onSelectPackage,
  selectedPackages = [],
  disabled = false,
  placeholder = "Search npm packages...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NpmPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [popularPackages, setPopularPackages] = useState<NpmPackage[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const popularFetchedRef = useRef(false);

  /**
   * Fetches weekly download counts for multiple packages.
   * Uses parallel individual requests for reliability with scoped packages.
   * @param packageNames - Array of package names
   * @returns Map of package name to download count
   */
  const fetchDownloadCounts = useCallback(
    async (packageNames: string[]): Promise<Map<string, number>> => {
      const downloadMap = new Map<string, number>();
      if (packageNames.length === 0) return downloadMap;

      // Fetch downloads for each package in parallel
      const fetchPromises = packageNames.map(async (name) => {
        try {
          const response = await fetch(
            `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`
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
    []
  );

  /**
   * Fetches popular packages with download counts.
   * Only fetches once per component mount.
   */
  const fetchPopularPackages = useCallback(async () => {
    // Skip if already fetched
    if (popularFetchedRef.current || popularPackages.length > 0) {
      return;
    }

    setIsLoadingPopular(true);
    popularFetchedRef.current = true;

    try {
      // Filter out already selected packages
      const availablePackages = POPULAR_PACKAGES.filter(
        (name) => !selectedPackages.includes(name)
      );

      if (availablePackages.length === 0) {
        setPopularPackages([]);
        return;
      }

      // Fetch download counts for popular packages
      const downloadCounts = await fetchDownloadCounts(availablePackages);

      // Create package objects with download counts, sorted by downloads
      const packagesWithDownloads: NpmPackage[] = availablePackages
        .map((name) => ({
          name,
          description: `Popular package`,
          weeklyDownloads: downloadCounts.get(name),
        }))
        .sort((a, b) => (b.weeklyDownloads ?? 0) - (a.weeklyDownloads ?? 0));

      setPopularPackages(packagesWithDownloads);
    } catch {
      // Silently fail - popular packages are optional
    } finally {
      setIsLoadingPopular(false);
    }
  }, [selectedPackages, fetchDownloadCounts, popularPackages.length]);

  /**
   * Fetches package suggestions from npm registry.
   */
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(searchQuery)}&size=10`
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
        })
      );
      // Filter out already selected packages
      const filteredPackages = packages.filter(
        (pkg) => !selectedPackages.includes(pkg.name)
      );

      // Fetch download counts for filtered packages
      const packageNames = filteredPackages.map((pkg) => pkg.name);
      const downloadCounts = await fetchDownloadCounts(packageNames);

      // Merge download counts into packages
      const packagesWithDownloads = filteredPackages.map((pkg) => ({
        ...pkg,
        weeklyDownloads: downloadCounts.get(pkg.name),
      }));

      setSuggestions(packagesWithDownloads);
      setHasSearched(true);
      setIsOpen(true);
    } catch {
      setSuggestions([]);
      setHasSearched(true);
      setError("Failed to search packages. Please try again.");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPackages, fetchDownloadCounts]);

  /**
   * Handles input change with debouncing.
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setSelectedIndex(-1);

      // Validate package name format
      const validationErr = validatePackageName(value);
      setValidationError(validationErr);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Only fetch if no validation error
      if (!validationErr) {
        debounceRef.current = setTimeout(() => {
          fetchSuggestions(value);
        }, 300);
      } else {
        // Clear suggestions when there's a validation error
        setSuggestions([]);
        setIsOpen(true);
        setHasSearched(false);
      }
    },
    [fetchSuggestions]
  );

  /**
   * Handles package selection.
   */
  const handleSelect = useCallback(
    (packageName: string) => {
      onSelectPackage(packageName);
      setQuery("");
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    },
    [onSelectPackage]
  );

  /**
   * Handles keyboard navigation.
   * Supports both search suggestions and popular packages lists.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Determine which list to use based on query state
      const filteredPopular = popularPackages.filter(
        (pkg) => !selectedPackages.includes(pkg.name)
      );
      const activeList = query.length === 0 ? filteredPopular : suggestions;

      if (!isOpen || activeList.length === 0) {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < activeList.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && activeList[selectedIndex]) {
            handleSelect(activeList[selectedIndex].name);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, suggestions, popularPackages, selectedPackages, query, selectedIndex, handleSelect]
  );

  /**
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xl px-0 sm:px-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length === 0) {
              // Show popular packages when focusing on empty input
              fetchPopularPackages();
              setIsOpen(true);
            } else if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10"
          aria-label="Search npm packages"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-invalid={!!validationError || !!error}
          aria-describedby={validationError ? "search-validation-error" : error ? "search-error" : undefined}
          role="combobox"
          aria-controls="search-suggestions-listbox"
        />
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {/* Screen reader announcement for loading state */}
        <span
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {isLoading ? "Searching for packages..." : ""}
        </span>
      </div>

      {isOpen && (suggestions.length > 0 || error || validationError || (hasSearched && !isLoading) || (query.length === 0 && (popularPackages.length > 0 || isLoadingPopular))) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
          id="search-suggestions-listbox"
          role="listbox"
        >
          {validationError ? (
            <div
              id="search-validation-error"
              className="px-3 py-6 text-center"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm font-medium text-destructive">{validationError}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Package names must be lowercase, no spaces, and use valid npm characters
              </p>
            </div>
          ) : error ? (
            <div
              id="search-error"
              className="px-3 py-6 text-center text-sm text-destructive"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          ) : query.length === 0 && (popularPackages.length > 0 || isLoadingPopular) ? (
            // Show popular packages when query is empty
            <>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                Popular packages
              </div>
              {isLoadingPopular ? (
                <div
                  className="flex items-center justify-center py-4"
                  role="status"
                  aria-busy="true"
                  aria-live="polite"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">Loading popular packages...</span>
                </div>
              ) : (
                <ul className="max-h-60 overflow-auto py-1">
                  {popularPackages.filter(pkg => !selectedPackages.includes(pkg.name)).map((pkg, index) => (
                    <li
                      key={pkg.name}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={cn(
                        "cursor-pointer px-3 py-2 hover:bg-accent",
                        index === selectedIndex && "bg-accent"
                      )}
                      onClick={() => handleSelect(pkg.name)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium font-mono">{pkg.name}</span>
                        {pkg.weeklyDownloads !== undefined && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                            <Download className="h-3 w-3" />
                            {formatDownloads(pkg.weeklyDownloads)}/wk
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {suggestions.map((pkg, index) => (
                <li
                  key={pkg.name}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={cn(
                    "cursor-pointer px-3 py-2 hover:bg-accent",
                    index === selectedIndex && "bg-accent"
                  )}
                  onClick={() => handleSelect(pkg.name)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium font-mono">{pkg.name}</span>
                    {pkg.weeklyDownloads !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                        <Download className="h-3 w-3" />
                        {formatDownloads(pkg.weeklyDownloads)}/wk
                      </span>
                    )}
                  </div>
                  {pkg.description && (
                    <div className="truncate text-sm text-muted-foreground">
                      {pkg.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No packages found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
