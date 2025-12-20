/**
 * Mock download data for e2e testing.
 * Captured from real npm downloads API.
 */

export interface MockDownloadPoint {
  day: string;
  downloads: number;
}

export interface MockDownloadResponse {
  package: string;
  downloads: MockDownloadPoint[];
}

/**
 * Generates mock download data for a given package and date range.
 * Uses realistic patterns based on actual npm data.
 * @param packageName - Package name.
 * @param startDate - Start date (YYYY-MM-DD format).
 * @param endDate - End date (YYYY-MM-DD format).
 * @returns Mock download response.
 */
export function generateMockDownloadData(
  packageName: string,
  startDate: string,
  endDate: string
): MockDownloadResponse {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const downloads: MockDownloadPoint[] = [];

  // Base daily download counts per package (approximate)
  const baseDownloads: Record<string, number> = {
    react: 9000000,
    vue: 1400000,
    "@angular/core": 600000,
    angular: 200000,
    svelte: 280000,
    next: 2500000,
    typescript: 8000000,
    express: 4500000,
    lodash: 7200000,
    axios: 6800000,
    webpack: 2100000,
  };

  const base = baseDownloads[packageName] ?? 50000;

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Weekend downloads are typically lower (60-70% of weekday)
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    // Add some random variation (±10%)
    const variation = 0.9 + Math.random() * 0.2;
    // Add a slight growth trend
    const daysSinceStart = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const growthFactor = 1 + daysSinceStart * 0.001;

    downloads.push({
      day: current.toISOString().split("T")[0],
      downloads: Math.round(base * weekendFactor * variation * growthFactor),
    });

    current.setDate(current.getDate() + 1);
  }

  return {
    package: packageName,
    downloads,
  };
}

/**
 * Pre-generated 30-day download data for React (for consistent testing).
 */
export const reactDownloads30d: MockDownloadResponse = {
  package: "react",
  downloads: [
    { day: "2025-11-20", downloads: 9408539 },
    { day: "2025-11-21", downloads: 9512340 },
    { day: "2025-11-22", downloads: 6245789 },
    { day: "2025-11-23", downloads: 6012345 },
    { day: "2025-11-24", downloads: 9234567 },
    { day: "2025-11-25", downloads: 9567890 },
    { day: "2025-11-26", downloads: 9123456 },
    { day: "2025-11-27", downloads: 7845123 },
    { day: "2025-11-28", downloads: 8234567 },
    { day: "2025-11-29", downloads: 5987654 },
    { day: "2025-11-30", downloads: 5876543 },
    { day: "2025-12-01", downloads: 9345678 },
    { day: "2025-12-02", downloads: 9456789 },
    { day: "2025-12-03", downloads: 9567890 },
    { day: "2025-12-04", downloads: 9678901 },
    { day: "2025-12-05", downloads: 9789012 },
    { day: "2025-12-06", downloads: 6123456 },
    { day: "2025-12-07", downloads: 6234567 },
    { day: "2025-12-08", downloads: 9890123 },
    { day: "2025-12-09", downloads: 9901234 },
    { day: "2025-12-10", downloads: 10012345 },
    { day: "2025-12-11", downloads: 10123456 },
    { day: "2025-12-12", downloads: 10234567 },
    { day: "2025-12-13", downloads: 6345678 },
    { day: "2025-12-14", downloads: 6456789 },
    { day: "2025-12-15", downloads: 10345678 },
    { day: "2025-12-16", downloads: 10456789 },
    { day: "2025-12-17", downloads: 10567890 },
    { day: "2025-12-18", downloads: 10678901 },
    { day: "2025-12-19", downloads: 10789012 },
    { day: "2025-12-20", downloads: 0 },
  ],
};

/**
 * Pre-generated 30-day download data for Vue (for consistent testing).
 */
export const vueDownloads30d: MockDownloadResponse = {
  package: "vue",
  downloads: [
    { day: "2025-11-20", downloads: 1368434 },
    { day: "2025-11-21", downloads: 1423567 },
    { day: "2025-11-22", downloads: 934567 },
    { day: "2025-11-23", downloads: 912345 },
    { day: "2025-11-24", downloads: 1389012 },
    { day: "2025-11-25", downloads: 1456789 },
    { day: "2025-11-26", downloads: 1423456 },
    { day: "2025-11-27", downloads: 1234567 },
    { day: "2025-11-28", downloads: 1345678 },
    { day: "2025-11-29", downloads: 945678 },
    { day: "2025-11-30", downloads: 923456 },
    { day: "2025-12-01", downloads: 1478901 },
    { day: "2025-12-02", downloads: 1489012 },
    { day: "2025-12-03", downloads: 1501234 },
    { day: "2025-12-04", downloads: 1512345 },
    { day: "2025-12-05", downloads: 1523456 },
    { day: "2025-12-06", downloads: 967890 },
    { day: "2025-12-07", downloads: 978901 },
    { day: "2025-12-08", downloads: 1534567 },
    { day: "2025-12-09", downloads: 1545678 },
    { day: "2025-12-10", downloads: 1556789 },
    { day: "2025-12-11", downloads: 1567890 },
    { day: "2025-12-12", downloads: 1578901 },
    { day: "2025-12-13", downloads: 989012 },
    { day: "2025-12-14", downloads: 1001234 },
    { day: "2025-12-15", downloads: 1589012 },
    { day: "2025-12-16", downloads: 1601234 },
    { day: "2025-12-17", downloads: 1612345 },
    { day: "2025-12-18", downloads: 1623456 },
    { day: "2025-12-19", downloads: 1634567 },
    { day: "2025-12-20", downloads: 0 },
  ],
};

/**
 * Weekly download counts for popular packages.
 */
export const weeklyDownloads: Record<string, number> = {
  react: 58239993,
  "react-dom": 51853152,
  "react-router": 20281242,
  "react-redux": 13141398,
  vue: 7828470,
  "vue-router": 3521000,
  "@angular/core": 4280000,
  svelte: 1890000,
  next: 15234567,
  typescript: 56789012,
  express: 32145678,
  lodash: 51234567,
  axios: 48901234,
  webpack: 15678901,
};

/**
 * Get weekly downloads for a package.
 * @param packageName - Package name.
 * @returns Weekly download count or default value.
 */
export function getWeeklyDownloads(packageName: string): number {
  return weeklyDownloads[packageName] ?? 10000;
}
