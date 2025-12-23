"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * List of popular npm packages for quick selection.
 * Curated based on download statistics and common use cases.
 */
const POPULAR_PACKAGES = [
  "react",
  "lodash",
  "react-dom",
  "axios",
  "chalk",
  "tslib",
  "commander",
  "inquirer",
  "express",
  "vue",
] as const;

interface PopularLibrariesProps {
  /**
   * Callback fired when a package is selected
   * @param name - The npm package name
   */
  onSelectPackage: (name: string) => void;
  /**
   * Array of currently selected package names
   * Used to disable already selected packages
   */
  selectedPackages: string[];
}

/**
 * Displays a list of popular npm packages for quick selection.
 * Packages that are already selected are visually muted and disabled.
 * @param onSelectPackage - Callback when a package is clicked
 * @param selectedPackages - Array of already selected package names
 * @example
 * <PopularLibraries
 *   onSelectPackage={(name) => console.log(`Selected: ${name}`)}
 *   selectedPackages={["react", "vue"]}
 * />
 */
export function PopularLibraries({
  onSelectPackage,
  selectedPackages,
}: PopularLibrariesProps) {
  return (
    <section
      data-testid="popular-libraries"
      className="flex flex-col gap-3"
      aria-labelledby="popular-libraries-title"
    >
      {/* Header with flame icon and accent underline */}
      <header className="flex flex-col gap-1">
        <h2
          id="popular-libraries-title"
          className="flex items-center gap-2 text-base font-semibold text-foreground"
        >
          <Flame
            className="size-5 text-orange-500 dark:text-orange-400"
            aria-hidden="true"
          />
          Popular libraries
        </h2>
        {/* Red accent underline - 3px height, 48px width */}
        <div
          className="h-[3px] w-12 rounded-full bg-red-500 dark:bg-red-400"
          aria-hidden="true"
        />
      </header>

      {/* Package list */}
      <ul className="flex flex-col gap-0.5" role="list">
        {POPULAR_PACKAGES.map((packageName) => {
          const isSelected = selectedPackages.includes(packageName);

          return (
            <li key={packageName}>
              <button
                type="button"
                onClick={() => onSelectPackage(packageName)}
                disabled={isSelected}
                className={cn(
                  // Base styles
                  "group w-full text-left font-mono text-sm py-2.5 px-3 rounded-md",
                  "min-h-[44px] transition-colors duration-150",
                  // Interactive states
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  // Enabled state: hover with dotted underline
                  !isSelected && [
                    "text-muted-foreground",
                    "hover:text-primary hover:bg-accent/50",
                    "cursor-pointer",
                  ],
                  // Disabled state: already selected
                  isSelected && [
                    "text-muted-foreground/50",
                    "cursor-not-allowed",
                    "line-through",
                  ]
                )}
                aria-label={
                  isSelected
                    ? `${packageName} - already selected`
                    : `Add ${packageName} to comparison`
                }
              >
                <span
                  className={cn(
                    "transition-all duration-150",
                    // Dotted underline on hover for enabled items
                    !isSelected && [
                      "border-b border-transparent",
                      "group-hover:border-dotted group-hover:border-primary/60",
                    ]
                  )}
                >
                  {packageName}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
