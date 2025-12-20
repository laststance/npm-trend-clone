"use client";

import { useState, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { PackageTagBar } from "@/components/package-tag-bar";
import { TrendChart } from "@/components/trend-chart";
import { getChartColor, MAX_PACKAGES } from "@/constants/colors";
import type { SelectedPackage, ChartDataPoint } from "@/types/package";

/**
 * Generates mock chart data for demonstration.
 * @param packages - Array of package names
 * @returns Mock chart data points
 */
function generateMockData(packages: string[]): ChartDataPoint[] {
  if (packages.length === 0) return [];

  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i -= 7) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const point: ChartDataPoint = { date: dateStr };
    packages.forEach((pkg, index) => {
      const baseDownloads = (index + 1) * 1_000_000;
      const variation = Math.sin(i / 30) * 200_000 + Math.random() * 100_000;
      const trend = (365 - i) * 5000;
      point[pkg] = Math.max(0, Math.round(baseDownloads + variation + trend));
    });

    data.push(point);
  }

  return data;
}

/**
 * Home page for npm trends comparison.
 * Allows users to search and compare npm package download statistics.
 */
export default function Home() {
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles package selection from search.
   */
  const handleSelectPackage = useCallback((packageName: string) => {
    setSelectedPackages((prev) => {
      if (prev.length >= MAX_PACKAGES) {
        return prev;
      }
      if (prev.some((p) => p.name === packageName)) {
        return prev;
      }
      const color = getChartColor(prev.length);
      return [...prev, { name: packageName, color }];
    });

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  /**
   * Handles package removal.
   */
  const handleRemovePackage = useCallback((packageName: string) => {
    setSelectedPackages((prev) => {
      const filtered = prev.filter((p) => p.name !== packageName);
      return filtered.map((p, index) => ({
        ...p,
        color: getChartColor(index),
      }));
    });
  }, []);

  const chartData = generateMockData(selectedPackages.map((p) => p.name));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">npm trends</h1>
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com/laststance/npm-trend-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Hero Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Compare npm package downloads
            </h2>
            <p className="mt-2 text-muted-foreground">
              Search and compare download trends for npm packages
            </p>
          </section>

          {/* Search Bar */}
          <section className="flex justify-center">
            <SearchBar
              onSelectPackage={handleSelectPackage}
              disabled={selectedPackages.length >= MAX_PACKAGES}
              placeholder={
                selectedPackages.length >= MAX_PACKAGES
                  ? `Maximum ${MAX_PACKAGES} packages reached`
                  : "Search npm packages..."
              }
            />
          </section>

          {/* Package Tags */}
          <section>
            <PackageTagBar
              packages={selectedPackages}
              onRemovePackage={handleRemovePackage}
            />
          </section>

          {/* Chart */}
          <section className="rounded-lg border bg-card p-4">
            <TrendChart
              data={chartData}
              packages={selectedPackages}
              isLoading={isLoading}
            />
          </section>

          {/* Info */}
          {selectedPackages.length === 0 && (
            <section className="text-center text-sm text-muted-foreground">
              <p>
                Try searching for popular packages like{" "}
                <button
                  onClick={() => handleSelectPackage("react")}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  react
                </button>
                ,{" "}
                <button
                  onClick={() => handleSelectPackage("vue")}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  vue
                </button>
                , or{" "}
                <button
                  onClick={() => handleSelectPackage("svelte")}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  svelte
                </button>
              </p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, shadcn/ui, and Recharts •{" "}
            <a
              href="https://github.com/laststance"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Laststance.io
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
