"use client";

import { TIME_RANGES, type TimeRange } from "@/types/package";
import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  /** Currently selected time range */
  value: TimeRange;
  /** Callback when time range changes */
  onChange: (range: TimeRange) => void;
}

/**
 * Horizontal button group for selecting chart time range.
 * @param value - Current time range
 * @param onChange - Callback when selection changes
 */
export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Time range selector" data-testid="time-range-selector">
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === range.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={value === range.value}
        >
          {range.value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
