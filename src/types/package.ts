/**
 * Represents an npm package with its metadata.
 */
export interface NpmPackage {
  /** Package name (e.g., "react", "@angular/core") */
  name: string;
  /** Package description */
  description?: string;
  /** Latest version */
  version?: string;
}

/**
 * Selected package for comparison with assigned color.
 */
export interface SelectedPackage {
  /** Package name */
  name: string;
  /** Assigned color in hex format (e.g., "#61dafb") */
  color: string;
}

/**
 * Download data point for a specific date.
 */
export interface DownloadDataPoint {
  /** Date in ISO format (e.g., "2024-01-01") */
  date: string;
  /** Download count for this date */
  downloads: number;
}

/**
 * Download statistics for a package.
 */
export interface PackageDownloads {
  /** Package name */
  package: string;
  /** Start date of the data range */
  start: string;
  /** End date of the data range */
  end: string;
  /** Array of download data points */
  downloads: DownloadDataPoint[];
}

/**
 * Chart data point with downloads from multiple packages.
 */
export interface ChartDataPoint {
  /** Date in ISO format */
  date: string;
  /** Dynamic keys for each package's download count */
  [packageName: string]: string | number;
}

/**
 * Time range options for the chart.
 */
export type TimeRange = "1m" | "3m" | "6m" | "1y" | "2y" | "5y";

/**
 * Time range configuration.
 */
export interface TimeRangeConfig {
  /** Time range key */
  value: TimeRange;
  /** Display label */
  label: string;
  /** Number of days */
  days: number;
}

/**
 * Available time ranges with their configurations.
 */
export const TIME_RANGES: TimeRangeConfig[] = [
  { value: "1m", label: "1 Month", days: 30 },
  { value: "3m", label: "3 Months", days: 90 },
  { value: "6m", label: "6 Months", days: 180 },
  { value: "1y", label: "1 Year", days: 365 },
  { value: "2y", label: "2 Years", days: 730 },
  { value: "5y", label: "5 Years", days: 1825 },
];
