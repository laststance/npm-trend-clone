"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SelectedPackage, ChartDataPoint } from "@/types/package";

interface TrendChartProps {
  /** Chart data with dates and download counts */
  data: ChartDataPoint[];
  /** Selected packages with colors */
  packages: SelectedPackage[];
  /** Whether to show loading state */
  isLoading?: boolean;
}

/**
 * Formats large numbers with K/M/B suffixes.
 * @param value - Number to format
 * @returns Formatted string (e.g., "1.5M")
 */
function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Formats date for display on X-axis.
 * @param dateStr - ISO date string
 * @returns Formatted date as "Mon YYYY" (e.g., "Jan 2025")
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Custom tooltip component for the chart.
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-lg">
      <p className="mb-2 text-sm font-medium text-foreground">
        {label ? new Date(label).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) : ""}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{formatNumber(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Time-series chart for package download trends.
 * Uses Recharts for rendering.
 * @param data - Array of data points with dates and downloads
 * @param packages - Selected packages with their colors
 * @param isLoading - Whether data is being loaded
 */
export function TrendChart({ data, packages, isLoading = false }: TrendChartProps) {
  const [hiddenLines, setHiddenLines] = useState<string[]>([]);

  /**
   * Handles legend item click to toggle line visibility.
   * @param dataKey - The package name (dataKey) of the clicked legend item
   */
  const handleLegendClick = (dataKey: string) => {
    setHiddenLines((prev) =>
      prev.includes(dataKey)
        ? prev.filter((name) => name !== dataKey)
        : [...prev, dataKey]
    );
  };

  if (packages.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
        <p className="text-muted-foreground">
          Search and select packages to compare download trends
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading download data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const packageNames = packages.map(p => p.name).join(", ");
  const ariaLabel = `Download trends chart comparing ${packages.length} npm package${packages.length === 1 ? "" : "s"}: ${packageNames}`;

  return (
    <div
      className="h-[400px] w-full"
      role="img"
      aria-label={ariaLabel}
      data-chart-container
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: "currentColor", fontSize: 12 }}
            tickLine={{ stroke: "currentColor" }}
            axisLine={{ stroke: "currentColor" }}
            className="text-muted-foreground"
            label={{
              value: "Date →",
              position: "insideBottomRight",
              offset: -5,
              style: { textAnchor: "end", fill: "currentColor", fontSize: 11 },
            }}
          />
          <YAxis
            tickFormatter={formatNumber}
            tick={{ fill: "currentColor", fontSize: 12 }}
            tickLine={{ stroke: "currentColor" }}
            axisLine={{ stroke: "currentColor" }}
            className="text-muted-foreground"
            label={{
              value: "↑ Downloads",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              style: { textAnchor: "middle", fill: "currentColor" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: 16,
            }}
            onClick={(e) => {
              if (e && e.dataKey) {
                handleLegendClick(e.dataKey as string);
              }
            }}
            formatter={(value: string) => (
              <span
                className="text-sm cursor-pointer select-none"
                style={{
                  color: hiddenLines.includes(value)
                    ? "var(--muted-foreground)"
                    : "var(--foreground)",
                  textDecoration: hiddenLines.includes(value)
                    ? "line-through"
                    : "none",
                  opacity: hiddenLines.includes(value) ? 0.5 : 1,
                }}
              >
                {value}
              </span>
            )}
          />
          {packages.map((pkg) => (
            <Line
              key={pkg.name}
              type="monotone"
              dataKey={pkg.name}
              stroke={pkg.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              hide={hiddenLines.includes(pkg.name)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
