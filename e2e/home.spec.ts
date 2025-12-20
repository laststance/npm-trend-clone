import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the search input", async ({ page }) => {
    const searchInput = page.getByRole("combobox");
    await expect(searchInput).toBeVisible();
  });

  test("should have no accessibility violations", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("should have correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/npm trend/i);
  });

  test("should toggle dark mode when clicking theme button", async ({
    page,
  }) => {
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Find the theme toggle button
    const themeButton = page.getByRole("button", { name: /toggle theme|switch to/i });
    await expect(themeButton).toBeVisible();

    // Get initial theme state (default is dark)
    const htmlElement = page.locator("html");
    const initialClass = await htmlElement.getAttribute("class");
    const wasDark = initialClass?.includes("dark");

    // Click to toggle
    await themeButton.click();
    await page.waitForTimeout(200);

    // Verify theme changed
    const newClass = await htmlElement.getAttribute("class");
    const isDark = newClass?.includes("dark");

    // Theme should have toggled
    expect(isDark).not.toBe(wasDark);
  });
});
