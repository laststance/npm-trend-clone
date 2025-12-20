"use client";

import { X, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { SelectedPackage } from "@/types/package";

interface PackageTagProps {
  /** Package data with name and color */
  package: SelectedPackage;
  /** Callback when the remove button is clicked */
  onRemove: (name: string) => void;
}

/**
 * Displays a colored tag for a selected package with remove and options buttons.
 * @param package - The package to display
 * @param onRemove - Callback when the package is removed
 */
export function PackageTag({ package: pkg, onRemove }: PackageTagProps) {
  return (
    <div
      data-testid="package-tag"
      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white shadow-sm"
      style={{ backgroundColor: pkg.color }}
    >
      <span className="max-w-[150px] truncate">{pkg.name}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-white/80 hover:text-white hover:bg-white/20"
            aria-label={`Options for ${pkg.name}`}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              window.open(`https://npmjs.com/package/${pkg.name}`, "_blank")
            }
          >
            View on npm
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.open(`https://github.com/search?q=${pkg.name}`, "_blank")
            }
          >
            Search on GitHub
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 text-white/80 hover:text-white hover:bg-white/20"
        onClick={() => onRemove(pkg.name)}
        aria-label={`Remove ${pkg.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
