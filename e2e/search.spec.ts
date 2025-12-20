import { test, expect } from "@playwright/test";

/**
 * E2E tests for package search functionality.
 * Uses MSW to mock npm registry API responses.
 */
test.describe("Package Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display search input with placeholder", async ({ page }) => {
    const searchInput = page.getByRole("combobox");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      /search npm packages/i
    );
  });

  test("should show suggestions when typing 'react'", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.click();
    await searchInput.fill("react");

    // Wait for suggestions to appear
    await page.waitForTimeout(500);

    // Should show react-related packages
    const suggestions = page.getByRole("option");
    await expect(suggestions.first()).toBeVisible({ timeout: 5000 });

    // Check for expected package names
    const suggestionTexts = await suggestions.allTextContents();
    expect(suggestionTexts.some((text) => text.includes("react"))).toBe(true);
  });

  test("should select a package from suggestions", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.click();
    await searchInput.fill("react");
    await page.waitForTimeout(500);

    // Click on the first suggestion
    const firstSuggestion = page.getByRole("option").first();
    await firstSuggestion.click();

    // Package tag should appear
    const packageTag = page.locator('[data-testid="package-tag"]').first();
    await expect(packageTag).toBeVisible({ timeout: 5000 });
  });

  test("should show popular packages on focus with empty input", async ({
    page,
  }) => {
    const searchInput = page.getByRole("combobox");

    // Focus on empty input
    await searchInput.click();

    // Should show popular packages dropdown
    await page.waitForTimeout(300);

    // Check if any suggestions appear
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 3000 });
  });

  test("should handle search with no results gracefully", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.click();
    await searchInput.fill("xyznonexistentpackage123");
    await page.waitForTimeout(500);

    // Should either show "No results" or empty state
    // The component should not crash
    await expect(searchInput).toBeVisible();
  });

  test("should clear search input after selecting a package", async ({
    page,
  }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.click();
    await searchInput.fill("react");
    await page.waitForTimeout(500);

    const firstSuggestion = page.getByRole("option").first();
    await firstSuggestion.click();

    // Input should be cleared after selection
    await expect(searchInput).toHaveValue("");
  });

  test("should close suggestions when clicking outside", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.click();
    await searchInput.fill("vue");
    await page.waitForTimeout(500);

    // Suggestions should be visible
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 3000 });

    // Click outside
    await page.click("body", { position: { x: 10, y: 10 } });

    // Suggestions should be hidden
    await expect(listbox).not.toBeVisible();
  });
});
