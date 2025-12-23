"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
  /** Category label text */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Callback when the button is clicked */
  onClick: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * A category button with icon and label for package discovery.
 * Displays an icon on the left with the category name.
 * Meets 44px minimum touch target requirement for accessibility.
 *
 * @param label - The category label text
 * @param icon - Lucide icon component to display
 * @param onClick - Callback when clicked
 * @param className - Optional additional class names
 *
 * @example
 * <CategoryButton
 *   label="Front-end"
 *   icon={Monitor}
 *   onClick={() => handleCategorySelect('Front-end')}
 * />
 */
export function CategoryButton({
  label,
  icon: Icon,
  onClick,
  className,
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Base layout
        "inline-flex items-center gap-3 w-full",
        // Sizing - meets 44px minimum touch target
        "min-h-[44px] px-4 py-3",
        // Visual styling
        "rounded-lg border border-border",
        "bg-card text-card-foreground",
        // Typography
        "text-sm font-medium",
        // Transitions
        "transition-all duration-200 ease-out",
        // Hover state
        "hover:bg-accent hover:text-accent-foreground",
        "hover:border-accent-foreground/20",
        "hover:shadow-sm",
        // Active state
        "active:scale-[0.98]",
        // Focus state - accessibility
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        className
      )}
      aria-label={`Select ${label} category`}
    >
      <Icon
        className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent-foreground"
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </button>
  );
}
