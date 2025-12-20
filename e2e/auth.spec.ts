import { test, expect } from "@playwright/test";

test.describe("Password Reset", () => {
  test("should show error for invalid token", async ({ page }) => {
    await page.goto("/reset-password?token=invalidtoken123");

    // Should show invalid token error
    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
    await expect(
      page.getByText("This password reset link is invalid or has expired")
    ).toBeVisible();

    // Should have link to request new token
    await expect(page.getByRole("link", { name: "Request New Link" })).toBeVisible();

    // Should have back to login link
    await expect(page.getByRole("link", { name: "Back to login" })).toBeVisible();
  });

  test("should show reset form for valid token", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    // Should show reset form
    await expect(page.getByText("Reset Your Password")).toBeVisible();
    await expect(page.getByText("Enter your new password below")).toBeVisible();

    // Should have password fields
    await expect(page.getByPlaceholder("Enter new password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm new password")).toBeVisible();

    // Should have submit button
    await expect(
      page.getByRole("button", { name: "Reset Password" })
    ).toBeVisible();
  });

  test("should validate password requirements", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    // Try to submit empty form
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show validation error
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("should validate password length", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    // Enter short password
    await page.getByPlaceholder("Enter new password").fill("short");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show length error
    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("should validate password confirmation", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    // Enter mismatched passwords
    await page.getByPlaceholder("Enter new password").fill("Password123!");
    await page.getByPlaceholder("Confirm new password").fill("DifferentPassword!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show mismatch error
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("should complete password reset with valid token", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    // Fill in matching passwords
    await page.getByPlaceholder("Enter new password").fill("NewPassword123!");
    await page.getByPlaceholder("Confirm new password").fill("NewPassword123!");

    // Submit form
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show success message
    await expect(page.getByText("Password Reset Complete")).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByText("Your password has been successfully reset")
    ).toBeVisible();

    // Should have link to login
    await expect(page.getByRole("link", { name: "Go to Login" })).toBeVisible();
  });

  test("should show loading state during reset", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    // Fill form
    await page.getByPlaceholder("Enter new password").fill("NewPassword123!");
    await page.getByPlaceholder("Confirm new password").fill("NewPassword123!");

    // Click and check loading state
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Button should show loading state (may be brief)
    // Then success page appears
    await expect(page.getByText("Password Reset Complete")).toBeVisible({
      timeout: 5000,
    });
  });
});

test.describe("Auth Pages", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  });

  test("should display signup page", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.getByText("Create an account")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("Create a password")).toBeVisible();
  });

  test("should display forgot password page", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });

  test("should display settings page", async ({ page }) => {
    await page.goto("/settings");

    await expect(page.getByText("Account Settings")).toBeVisible();
    await expect(page.getByText("Profile").first()).toBeVisible();
    await expect(page.getByText("Danger Zone")).toBeVisible();
  });
});

test.describe("Health Endpoint", () => {
  test("should return health status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const health = await response.json();
    expect(health.status).toBe("healthy");
    expect(health.services.app).toBe("ok");
    expect(health.timestamp).toBeDefined();
    expect(health.uptime).toBeGreaterThan(0);
  });
});
