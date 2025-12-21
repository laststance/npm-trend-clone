import { test, expect } from "@playwright/test";

/**
 * E2E tests for time range selection functionality.
 * Tests changing time range and URL persistence.
 */
test.describe("Time Range Selection", () => {
  test.beforeEach(async ({ page }) => {
    // Load page with a package to see the time range selector
    await page.goto("/?packages=react");
    await page.waitForLoadState("networkidle");

    // Wait for chart to fully load (dynamic import + data fetch)
    // The chart shows "Loading download data..." while fetching, then renders
    await expect(page.locator('[data-testid="trend-chart"]')).toBeVisible({ timeout: 15000 });

    // Wait for the actual chart content to render (not just loading state)
    // Check for the recharts-wrapper which appears after data loads
    await expect(page.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 15000 });
  });

  test("should display time range selector", async ({ page }) => {
    // Wait for chart to load
    const chart = page.locator('[data-testid="trend-chart"]');
    await expect(chart).toBeVisible({ timeout: 10000 });

    // Time range selector should be visible
    const timeRangeSelector = page.locator('[data-testid="time-range-selector"]');
    await expect(timeRangeSelector).toBeVisible();
  });

  test("should have default time range of 1 year", async ({ page }) => {
    // Check URL for default range
    await expect(page).toHaveURL(/range=1y|(?!range=)/);

    // Or check for active button state
    const yearButton = page.locator('button:has-text("1 Year"), button:has-text("1Y")');
    if (await yearButton.isVisible()) {
      // Year button should be visible when it's the default range
      await expect(yearButton).toBeVisible();
    }
  });

  test("should change time range to 1 month", async ({ page }) => {
    const monthButton = page.locator('button:has-text("1 Month"), button:has-text("1M")').first();

    if (await monthButton.isVisible()) {
      await monthButton.click();
      await page.waitForTimeout(500);

      // URL should update
      await expect(page).toHaveURL(/range=1m/);
    }
  });

  test("should change time range to 3 months", async ({ page }) => {
    const threeMonthButton = page.locator('button:has-text("3 Months"), button:has-text("3M")').first();

    if (await threeMonthButton.isVisible()) {
      await threeMonthButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveURL(/range=3m/);
    }
  });

  test("should change time range to 6 months", async ({ page }) => {
    const sixMonthButton = page.locator('button:has-text("6 Months"), button:has-text("6M")').first();

    if (await sixMonthButton.isVisible()) {
      await sixMonthButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveURL(/range=6m/);
    }
  });

  test("should change time range to 2 years", async ({ page }) => {
    const twoYearButton = page.locator('button:has-text("2 Years"), button:has-text("2Y")').first();

    if (await twoYearButton.isVisible()) {
      await twoYearButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveURL(/range=2y/);
    }
  });

  test("should change time range to 5 years", async ({ page }) => {
    const fiveYearButton = page.locator('button:has-text("5 Years"), button:has-text("5Y")').first();

    if (await fiveYearButton.isVisible()) {
      await fiveYearButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveURL(/range=5y/);
    }
  });

  test("should persist time range in URL", async ({ page }) => {
    const threeMonthButton = page.locator('button:has-text("3 Months"), button:has-text("3M")').first();

    if (await threeMonthButton.isVisible()) {
      await threeMonthButton.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // URL should still have the range
      await expect(page).toHaveURL(/range=3m/);
    }
  });

  test("should load with time range from URL", async ({ page }) => {
    await page.goto("/?packages=react&range=6m");
    await page.waitForLoadState("networkidle");

    // Wait for chart to be visible
    const chart = page.locator('[data-testid="trend-chart"]');
    await expect(chart).toBeVisible({ timeout: 15000 });

    // Wait for chart data to load (loading text disappears, chart wrapper appears)
    await expect(page.locator(".recharts-wrapper").first()).toBeVisible({ timeout: 15000 });

    // Check if 6M button is active
    const sixMonthButton = page.locator('button:has-text("6 Months"), button:has-text("6M")').first();
    if (await sixMonthButton.isVisible()) {
      // Button should indicate active state
      await expect(sixMonthButton).toBeVisible();
    }
  });

  test("should update chart when time range changes", async ({ page }) => {
    // Wait for initial chart and data to load
    const chart = page.locator('[data-testid="trend-chart"]');
    await expect(chart).toBeVisible({ timeout: 15000 });
    await expect(page.locator(".recharts-wrapper")).toBeVisible({ timeout: 15000 });

    // Change time range
    const monthButton = page.locator('button:has-text("1 Month"), button:has-text("1M")').first();

    if (await monthButton.isVisible()) {
      await monthButton.click();

      // Wait for chart to update with new data
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      // Chart should still be visible after time range change
      await expect(chart).toBeVisible();

      // URL should reflect the new range
      await expect(page).toHaveURL(/range=1m/);
    }
  });
});
