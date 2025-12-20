"use client";

import { useCallback, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { SearchBar } from "@/components/search-bar";
import { PackageTagBar } from "@/components/package-tag-bar";
import { TrendChart } from "@/components/trend-chart";
import { TimeRangeSelector } from "@/components/time-range-selector";
import { ShareButton } from "@/components/share-button";
import { ExportButton } from "@/components/export-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  PackageInfoCard,
  PackageInfoCardSkeleton,
  PackageInfoCardError,
} from "@/components/package-info-card";
import { MAX_PACKAGES } from "@/constants/colors";
import { useUrlState } from "@/hooks/use-url-state";
import { useDownloads } from "@/hooks/use-downloads";
import { usePackageInfo } from "@/hooks/use-package-info";

/**
 * Inner component that uses URL state hooks.
 */
function HomeContent() {
  const { selectedPackages, timeRange, addPackage, removePackage, setTimeRange } = useUrlState();
  const packageNames = selectedPackages.map((p) => p.name);
  const { data: chartData, isLoading, error, invalidPackages } = useDownloads(packageNames, timeRange);
  const { data: packageInfoData, isLoading: isLoadingInfo } = usePackageInfo(packageNames);

  /**
   * Shows toast notification for invalid packages.
   */
  useEffect(() => {
    if (invalidPackages.length > 0) {
      for (const pkgName of invalidPackages) {
        toast.error(`Package "${pkgName}" not found`, {
          description: "This package doesn't exist on npm",
          duration: 4000,
        });
      }
    }
  }, [invalidPackages]);

  /**
   * Handles package selection from search.
   */
  const handleSelectPackage = useCallback(
    async (packageName: string) => {
      if (selectedPackages.length >= MAX_PACKAGES) return;
      await addPackage(packageName);
    },
    [selectedPackages.length, addPackage]
  );

  /**
   * Handles package removal.
   */
  const handleRemovePackage = useCallback(
    async (packageName: string) => {
      await removePackage(packageName);
    },
    [removePackage]
  );

  // Show error state if API fails
  if (error && packageNames.length > 0) {
    console.error("Download data error:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">npm trends</h1>
          <nav className="flex items-center gap-2">
            <a
              href="https://github.com/laststance/npm-trend-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
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
              selectedPackages={packageNames}
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

          {/* Time Range Selector & Actions */}
          {selectedPackages.length > 0 && (
            <section className="flex items-center justify-center gap-4">
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              <ExportButton disabled={isLoading} />
              <ShareButton />
            </section>
          )}

          {/* Chart */}
          <section className="rounded-lg p-4">
            <TrendChart
              data={chartData}
              packages={selectedPackages}
              isLoading={isLoading}
            />
          </section>

          {/* Package Info Cards */}
          {selectedPackages.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Package Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedPackages.map((pkg) => {
                  const info = packageInfoData[pkg.name];

                  if (isLoadingInfo && !info) {
                    return <PackageInfoCardSkeleton key={pkg.name} />;
                  }

                  if (!info) {
                    return (
                      <PackageInfoCardError
                        key={pkg.name}
                        packageName={pkg.name}
                        accentColor={pkg.color}
                        onRemove={() => handleRemovePackage(pkg.name)}
                      />
                    );
                  }

                  return (
                    <PackageInfoCard
                      key={pkg.name}
                      packageInfo={info}
                      accentColor={pkg.color}
                      onRemove={() => handleRemovePackage(pkg.name)}
                    />
                  );
                })}
              </div>
            </section>
          )}

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

/**
 * Home page for npm trends comparison.
 * Allows users to search and compare npm package download statistics.
 * Uses Suspense for nuqs URL state hydration.
 */
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
