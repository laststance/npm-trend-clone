"use client";

import { useRef, useEffect, useId } from "react";
import { Search, Loader2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NpmPackage } from "@/types/package";
import { useSearchBar, EMPTY_PACKAGES } from "@/hooks/use-search-bar";

// ─────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────

/**
 * Formats a number to a human-readable string (e.g., 1500000 -> "1.5M").
 * @param num - The number to format
 * @returns Formatted string with K/M/B suffix
 * @example
 * formatDownloads(1500000) // => "1.5M"
 * formatDownloads(2300)    // => "2.3K"
 * formatDownloads(500)     // => "500"
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

// ─────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────

interface PackageListItemProps {
  pkg: NpmPackage;
  index: number;
  selectedIndex: number;
  onSelect: (name: string) => void;
  onHover: (index: number) => void;
  showDescription?: boolean;
}

/**
 * Single package option in the dropdown list.
 * Shared between popular packages and search suggestions to avoid duplication.
 */
function PackageListItem({
  pkg,
  index,
  selectedIndex,
  onSelect,
  onHover,
  showDescription = false,
}: PackageListItemProps) {
  return (
    <li
      key={pkg.name}
      role="option"
      aria-selected={index === selectedIndex}
      className={cn(
        "cursor-pointer px-3 py-2 hover:bg-accent",
        index === selectedIndex && "bg-accent",
      )}
      onClick={() => onSelect(pkg.name)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(pkg.name);
        }
      }}
      onMouseEnter={() => onHover(index)}
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
      {showDescription && pkg.description && (
        <div className="truncate text-sm text-muted-foreground">
          {pkg.description}
        </div>
      )}
    </li>
  );
}

interface PopularPackageListProps {
  packages: NpmPackage[];
  isLoading: boolean;
  selectedIndex: number;
  selectedPackages: string[];
  onSelect: (name: string) => void;
  onHover: (index: number) => void;
}

/**
 * Popular packages section shown when the search input is focused but empty.
 */
function PopularPackageList({
  packages,
  isLoading,
  selectedIndex,
  selectedPackages,
  onSelect,
  onHover,
}: PopularPackageListProps) {
  return (
    <>
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
        Popular packages
      </div>
      {isLoading ? (
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
          {packages
            .filter((pkg) => !selectedPackages.includes(pkg.name))
            .map((pkg, index) => (
              <PackageListItem
                key={pkg.name}
                pkg={pkg}
                index={index}
                selectedIndex={selectedIndex}
                onSelect={onSelect}
                onHover={onHover}
              />
            ))}
        </ul>
      )}
    </>
  );
}

interface SuggestionListProps {
  suggestions: NpmPackage[];
  selectedIndex: number;
  onSelect: (name: string) => void;
  onHover: (index: number) => void;
}

/**
 * Search suggestion results list with descriptions.
 */
function SuggestionList({
  suggestions,
  selectedIndex,
  onSelect,
  onHover,
}: SuggestionListProps) {
  return (
    <ul className="max-h-60 overflow-auto py-1">
      {suggestions.map((pkg, index) => (
        <PackageListItem
          key={pkg.name}
          pkg={pkg}
          index={index}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onHover={onHover}
          showDescription
        />
      ))}
    </ul>
  );
}

interface SearchDropdownProps {
  listboxId: string;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  validationError: string | null;
  error: string | null;
  query: string;
  suggestions: NpmPackage[];
  popularPackages: NpmPackage[];
  isLoadingPopular: boolean;
  hasSearched: boolean;
  isLoading: boolean;
  selectedIndex: number;
  selectedPackages: string[];
  onSelect: (name: string) => void;
  onHover: (index: number) => void;
}

/**
 * Dropdown container with conditional rendering for validation errors,
 * search errors, popular packages, search suggestions, and empty states.
 */
function SearchDropdown({
  listboxId,
  dropdownRef,
  validationError,
  error,
  query,
  suggestions,
  popularPackages,
  isLoadingPopular,
  hasSearched,
  isLoading,
  selectedIndex,
  selectedPackages,
  onSelect,
  onHover,
}: SearchDropdownProps) {
  const showPopular = query.length === 0 && (popularPackages.length > 0 || isLoadingPopular);

  if (validationError) {
    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
        id={`${listboxId}-listbox`}
        role="listbox"
      >
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
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
        id={`${listboxId}-listbox`}
        role="listbox"
      >
        <div
          id="search-error"
          className="px-3 py-6 text-center text-sm text-destructive"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      </div>
    );
  }

  if (showPopular) {
    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
        id={`${listboxId}-listbox`}
        role="listbox"
      >
        <PopularPackageList
          packages={popularPackages}
          isLoading={isLoadingPopular}
          selectedIndex={selectedIndex}
          selectedPackages={selectedPackages}
          onSelect={onSelect}
          onHover={onHover}
        />
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
        id={`${listboxId}-listbox`}
        role="listbox"
      >
        <SuggestionList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onHover={onHover}
        />
      </div>
    );
  }

  if (hasSearched && !isLoading) {
    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
        id={`${listboxId}-listbox`}
        role="listbox"
      >
        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
          No packages found
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────

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
 * @param selectedPackages - Already selected packages to exclude
 * @param disabled - Whether the search is disabled
 * @param placeholder - Placeholder text for the input
 */
export function SearchBar({
  onSelectPackage,
  selectedPackages = EMPTY_PACKAGES,
  disabled = false,
  placeholder = "Search npm packages...",
}: SearchBarProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    state,
    handleInputChange,
    handleSelect: hookHandleSelect,
    handleKeyDown,
    fetchPopularPackages,
    openDropdown,
    closeDropdown,
    setSelectedIndex,
  } = useSearchBar({ onSelectPackage, selectedPackages });

  const handleSelect = (packageName: string) => {
    hookHandleSelect(packageName);
    inputRef.current?.focus();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const isDropdownVisible =
    state.isOpen &&
    (state.suggestions.length > 0 ||
      state.error ||
      state.validationError ||
      (state.hasSearched && !state.isLoading) ||
      (state.query.length === 0 &&
        (state.popularPackages.length > 0 || state.isLoadingPopular)));

  return (
    <div className="relative w-full max-w-xl px-0 sm:px-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={state.query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (state.query.length === 0) {
              fetchPopularPackages();
              openDropdown();
            } else if (state.suggestions.length > 0) {
              openDropdown();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10"
          aria-label="Search npm packages"
          aria-expanded={state.isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-invalid={!!state.validationError || !!state.error}
          aria-describedby={
            state.validationError
              ? "search-validation-error"
              : state.error
                ? "search-error"
                : undefined
          }
          role="combobox"
          aria-controls={`${listboxId}-listbox`}
        />
        {state.isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <span role="status" aria-live="polite" className="sr-only">
          {state.isLoading ? "Searching for packages..." : ""}
        </span>
      </div>

      {isDropdownVisible && (
        <SearchDropdown
          listboxId={listboxId}
          dropdownRef={dropdownRef}
          validationError={state.validationError}
          error={state.error}
          query={state.query}
          suggestions={state.suggestions}
          popularPackages={state.popularPackages}
          isLoadingPopular={state.isLoadingPopular}
          hasSearched={state.hasSearched}
          isLoading={state.isLoading}
          selectedIndex={state.selectedIndex}
          selectedPackages={selectedPackages}
          onSelect={handleSelect}
          onHover={setSelectedIndex}
        />
      )}
    </div>
  );
}
