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
});
