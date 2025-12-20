"use client";

import { PackageTag } from "./package-tag";
import type { SelectedPackage } from "@/types/package";

interface PackageTagBarProps {
  /** Array of selected packages */
  packages: SelectedPackage[];
  /** Callback when a package is removed */
  onRemovePackage: (name: string) => void;
}

/**
 * Displays a horizontal bar of package tags.
 * @param packages - Array of selected packages to display
 * @param onRemovePackage - Callback when a package is removed
 */
export function PackageTagBar({
  packages,
  onRemovePackage,
}: PackageTagBarProps) {
  if (packages.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap gap-2 p-4"
      role="list"
      aria-label="Selected packages"
    >
      {packages.map((pkg) => (
        <PackageTag key={pkg.name} package={pkg} onRemove={onRemovePackage} />
      ))}
    </div>
  );
}
