import { test, expect } from "@playwright/test";

/**
 * E2E tests for the preset management feature.
 * Tests saving, loading, renaming, and deleting package comparison presets.
 *
 * Note: Presets are stored in localStorage, so we clear them before each test.
 */
test.describe("Preset Management", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Wait for MSW to be ready
    await page.waitForTimeout(100);
  });

  test("should show empty preset dropdown initially", async ({ page }) => {
    // Wait for the page to be ready
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });

    // Click on the preset button in the header
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await expect(presetButton).toBeVisible();
    await presetButton.click();

    // Verify dropdown content shows "No presets saved yet"
    const emptyMessage = page.getByText("No presets saved yet");
    await expect(emptyMessage).toBeVisible({ timeout: 3000 });
  });

  test("should save a preset with packages selected", async ({ page }) => {
    // First, add a package to enable saving
    const searchInput = page.getByRole("combobox");
    await searchInput.click();
    await searchInput.fill("react");

    // Wait for and select suggestion
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 10000 });

    const suggestions = page.getByRole("option");
    const suggestionCount = await suggestions.count();

    if (suggestionCount === 0) {
      test.skip(true, "MSW not intercepting - skipping preset save test");
      return;
    }

    await suggestions.first().click();

    // Wait for package tag to appear
    const packageTag = page.locator('[data-testid="package-tag"]').first();
    await expect(packageTag).toBeVisible({ timeout: 5000 });

    // Now click preset button (in header or action bar)
    // Wait for the preset button to be visible
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await presetButton.click();

    // Click "Save current as preset"
    const saveOption = page.getByText("Save current as preset");
    await expect(saveOption).toBeVisible({ timeout: 3000 });
    await saveOption.click();

    // Fill in preset name in dialog
    const presetNameInput = page.getByPlaceholder("Preset name");
    await expect(presetNameInput).toBeVisible({ timeout: 3000 });
    await presetNameInput.fill("My React Preset");

    // Click Save button
    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();

    // Verify toast notification
    const toast = page.getByText('Preset "My React Preset" saved');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test("should load a saved preset", async ({ page }) => {
    // Pre-populate localStorage with a preset
    await page.evaluate(() => {
      const presets = [
        {
          id: "test-preset-1",
          name: "Test Preset",
          packages: ["react", "vue"],
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem("npm-trends-presets", JSON.stringify(presets));
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100);

    // Wait for preset button and click it
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await presetButton.click();

    // Click on the saved preset
    const presetItem = page.getByText("Test Preset").first();
    await expect(presetItem).toBeVisible({ timeout: 3000 });
    await presetItem.click();

    // Verify packages are loaded (wait for package tags)
    await page.waitForTimeout(500); // Wait for URL update and re-render

    // Check if packages are loaded by looking for package tags
    const packageTags = page.locator('[data-testid="package-tag"]');
    await expect(packageTags).toHaveCount(2, { timeout: 10000 });
  });

  test("should delete a preset", async ({ page }) => {
    // Pre-populate localStorage with a preset
    await page.evaluate(() => {
      const presets = [
        {
          id: "test-preset-delete",
          name: "Preset To Delete",
          packages: ["lodash"],
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem("npm-trends-presets", JSON.stringify(presets));
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100);

    // Wait for preset button and click
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await presetButton.click();

    // Hover over the preset to reveal delete button
    const presetItem = page.getByText("Preset To Delete");
    await expect(presetItem).toBeVisible({ timeout: 3000 });
    await presetItem.hover();

    // Click delete button
    const deleteButton = page.locator('[aria-label="Delete preset Preset To Delete"]');
    await expect(deleteButton).toBeVisible({ timeout: 3000 });
    await deleteButton.click();

    // Confirm deletion in dialog
    const confirmDeleteButton = page.getByRole("button", { name: "Delete" });
    await expect(confirmDeleteButton).toBeVisible({ timeout: 3000 });
    await confirmDeleteButton.click();

    // Verify toast notification
    const toast = page.getByText('Preset "Preset To Delete" deleted');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test("should rename a preset", async ({ page }) => {
    // Pre-populate localStorage with a preset
    await page.evaluate(() => {
      const presets = [
        {
          id: "test-preset-rename",
          name: "Old Name",
          packages: ["express"],
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem("npm-trends-presets", JSON.stringify(presets));
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100);

    // Wait for preset button and click
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await presetButton.click();

    // Hover over the preset to reveal rename button
    const presetItem = page.getByText("Old Name");
    await expect(presetItem).toBeVisible({ timeout: 3000 });
    await presetItem.hover();

    // Click rename button
    const renameButton = page.locator('[aria-label="Rename preset Old Name"]');
    await expect(renameButton).toBeVisible({ timeout: 3000 });
    await renameButton.click();

    // Fill in new name
    const nameInput = page.getByPlaceholder("Preset name");
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.clear();
    await nameInput.fill("New Name");

    // Click Rename button
    const renameConfirmButton = page.getByRole("button", { name: "Rename" });
    await renameConfirmButton.click();

    // Verify toast notification
    const toast = page.getByText("Preset renamed");
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test("should show preset count in dropdown label", async ({ page }) => {
    // Pre-populate localStorage with 2 presets
    await page.evaluate(() => {
      const presets = [
        {
          id: "preset-1",
          name: "Preset 1",
          packages: ["react"],
          createdAt: Date.now(),
        },
        {
          id: "preset-2",
          name: "Preset 2",
          packages: ["vue"],
          createdAt: Date.now() - 1000,
        },
      ];
      localStorage.setItem("npm-trends-presets", JSON.stringify(presets));
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100);

    // Wait for preset button and click
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await presetButton.click();

    // Verify the dropdown label shows count (2/10)
    const labelText = page.getByText(/Presets \(2\/10\)/);
    await expect(labelText).toBeVisible({ timeout: 3000 });
  });

  test("should show package count for each preset", async ({ page }) => {
    // Pre-populate localStorage with a preset with multiple packages
    await page.evaluate(() => {
      const presets = [
        {
          id: "multi-pkg-preset",
          name: "Multi Package",
          packages: ["react", "vue", "angular"],
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem("npm-trends-presets", JSON.stringify(presets));
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100);

    // Wait for preset button and click
    await page.waitForSelector('[aria-label="Manage presets"]', {
      state: "visible",
      timeout: 5000,
    });
    const presetButton = page.locator('[aria-label="Manage presets"]').first();
    await presetButton.click();

    // Verify the package count is shown
    const pkgCount = page.getByText("3 pkg");
    await expect(pkgCount).toBeVisible({ timeout: 3000 });
  });
});
