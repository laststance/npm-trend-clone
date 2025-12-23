"use client";

import {
  Search,
  Monitor,
  Server,
  Terminal,
  FileText,
  Palette,
  CheckCircle,
  Cpu,
  Target,
  Smartphone,
  Layers,
  Bot,
  Calculator,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CategoryButton } from "@/components/category-button";
import {
  CATEGORY_PRESETS,
  type CategoryName,
} from "@/constants/category-presets";

/**
 * Category configuration with icon mapping.
 */
const CATEGORY_ICONS: Record<CategoryName, LucideIcon> = {
  "Front-end": Monitor,
  "Back-end": Server,
  CLI: Terminal,
  Documentation: FileText,
  CSS: Palette,
  Testing: CheckCircle,
  IoT: Cpu,
  Coverage: Target,
  Mobile: Smartphone,
  Frameworks: Layers,
  Robotics: Bot,
  Math: Calculator,
} as const;

/**
 * Ordered list of categories for display.
 */
const CATEGORY_ORDER: CategoryName[] = [
  "Front-end",
  "Back-end",
  "CLI",
  "Documentation",
  "CSS",
  "Testing",
  "IoT",
  "Coverage",
  "Mobile",
  "Frameworks",
  "Robotics",
  "Math",
] as const;

interface DiscoverPackagesProps {
  /** Callback when a category is selected, receives the list of packages */
  onSelectCategory: (packages: string[]) => void;
}

/**
 * Discover packages section with category grid.
 * Displays a title with search icon and a responsive grid of category buttons.
 *
 * @param onSelectCategory - Callback receiving package list when category clicked
 *
 * @example
 * <DiscoverPackages
 *   onSelectCategory={(packages) => setSelectedPackages(packages)}
 * />
 */
export function DiscoverPackages({ onSelectCategory }: DiscoverPackagesProps) {
  /**
   * Handles category button click.
   * @param category - The selected category name
   */
  const handleCategoryClick = (category: CategoryName) => {
    const packages = CATEGORY_PRESETS[category];
    onSelectCategory([...packages]);
  };

  return (
    <section
      aria-labelledby="discover-packages-title"
      className="w-full"
      data-testid="discover-packages"
    >
      {/* Section header */}
      <div className="mb-6">
        <h2
          id="discover-packages-title"
          className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight"
        >
          <Search
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="relative">
            Discover packages
            {/* Orange accent underline */}
            <span
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-amber-500"
              aria-hidden="true"
            />
          </span>
        </h2>
      </div>

      {/* Category grid - responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div
        className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Package categories"
      >
        {CATEGORY_ORDER.map((category) => (
          <div key={category} role="listitem">
            <CategoryButton
              label={category}
              icon={CATEGORY_ICONS[category]}
              onClick={() => handleCategoryClick(category)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
