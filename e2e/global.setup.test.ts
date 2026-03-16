import { test, expect } from "@playwright/test";

/**
 * Warms up the Next.js server by loading the home page and login page.
 * This triggers initial DB connection pool creation and page hydration,
 * preventing cold-start timeouts in subsequent tests.
 */
test("warm up app", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle", timeout: 30000 });
  await expect(page.locator("body")).toBeVisible();

  await page.goto("/login", { waitUntil: "networkidle", timeout: 30000 });
  await expect(page.locator("body")).toBeVisible();
});
