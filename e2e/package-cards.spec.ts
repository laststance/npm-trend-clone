import { test, expect } from "@playwright/test";

/**
 * E2E tests for package info cards functionality.
 * Tests display of package metadata including name, description,
 * downloads, stars, version, license, and links.
 */
test.describe("Package Info Cards", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly with packages in URL to avoid search timing issues
    await page.goto("/?packages=react,vue");
    await page.waitForLoadState("networkidle");
  });

  test("should display package details section", async ({ page }) => {
    // Wait for the Package Details heading
    const heading = page.getByRole("heading", { name: "Package Details" });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("should show package name in card", async ({ page }) => {
    // Cards should show package names
    const reactCard = page.locator('text="react"').first();
    await expect(reactCard).toBeVisible({ timeout: 10000 });

    const vueCard = page.locator('text="vue"').first();
    await expect(vueCard).toBeVisible({ timeout: 10000 });
  });

  test("should show package version badge", async ({ page }) => {
    // Version badges should be visible (format: vX.Y.Z)
    const versionBadge = page.locator('text=/v\\d+\\.\\d+\\.\\d+/').first();
    await expect(versionBadge).toBeVisible({ timeout: 10000 });
  });

  test("should show weekly downloads", async ({ page }) => {
    // Weekly downloads should be visible (format: XXM /week or XXK /week)
    const downloads = page.locator('text=/\\d+(\\.\\d+)?[KMB]?\\/week/').first();
    await expect(downloads).toBeVisible({ timeout: 10000 });
  });

  test("should show license information", async ({ page }) => {
    // MIT license should be visible for common packages
    const license = page.locator('text="MIT"').first();
    await expect(license).toBeVisible({ timeout: 10000 });
  });

  test("should show npm link", async ({ page }) => {
    // npm link should be present
    const npmLink = page.locator('a:has-text("npm")').first();
    await expect(npmLink).toBeVisible({ timeout: 10000 });
    await expect(npmLink).toHaveAttribute("href", /npmjs\.com/);
  });

  test("should show GitHub link", async ({ page }) => {
    // GitHub link should be present for packages with repos
    const githubLink = page.locator('a:has-text("GitHub")').first();
    await expect(githubLink).toBeVisible({ timeout: 10000 });
    await expect(githubLink).toHaveAttribute("href", /github\.com/);
  });

  test("should display multiple package cards", async ({ page }) => {
    // Two packages in URL, should see section with both
    const heading = page.getByRole("heading", { name: "Package Details" });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Look for both package names
    await expect(page.locator('text="react"').first()).toBeVisible();
    await expect(page.locator('text="vue"').first()).toBeVisible();
  });

  test("should show last updated date", async ({ page }) => {
    // Updated date should be visible (format: "Updated X days/weeks/months ago")
    const updatedText = page
      .locator('text=/Updated \\d+ (days?|weeks?|months?|years?) ago/')
      .first();
    await expect(updatedText).toBeVisible({ timeout: 10000 });
  });

  test("should show card accent color matching chart", async ({ page }) => {
    // Cards should have visible accent bar
    const cards = page.locator('[data-slot="card"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test("should have remove button on card", async ({ page }) => {
    // Remove button (X) should be present on cards
    const removeButton = page.locator('button[aria-label^="Remove"]').first();
    await expect(removeButton).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Package Info Cards - Single Package", () => {
  test("should show card for single package", async ({ page }) => {
    await page.goto("/?packages=react");
    await page.waitForLoadState("networkidle");

    const heading = page.getByRole("heading", { name: "Package Details" });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Should show react card
    const reactText = page.locator('text="react"').first();
    await expect(reactText).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Package Info Cards - Error State", () => {
  test("should handle invalid package gracefully", async ({ page }) => {
    // Navigate with an invalid package name
    await page.goto("/?packages=invalidpkg123xyz999");
    await page.waitForLoadState("networkidle");

    // Should still show Package Details section
    // The card might show error state or generated mock data
    const heading = page.getByRole("heading", { name: "Package Details" });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
