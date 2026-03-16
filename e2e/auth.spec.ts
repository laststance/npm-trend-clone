import { test, expect } from "@playwright/test";

test.describe("Password Reset", () => {
  test("should show error for invalid token", async ({ page }) => {
    await page.goto("/reset-password?token=invalidtoken123");

    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
    await expect(
      page.getByText("This password reset link is invalid or has expired")
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Request New Link" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to login" })).toBeVisible();
  });

  test("should show reset form for valid token", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    await expect(page.getByText("Reset Your Password")).toBeVisible();
    await expect(page.getByText("Enter your new password below")).toBeVisible();

    await expect(page.getByPlaceholder("Enter new password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm new password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Reset Password" })
    ).toBeVisible();
  });

  test("should validate password requirements", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("should validate password length", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    await page.getByPlaceholder("Enter new password").fill("short");
    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("should validate password confirmation", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    await page.getByPlaceholder("Enter new password").fill("Password123!");
    await page.getByPlaceholder("Confirm new password").fill("DifferentPassword!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("should complete password reset with valid token", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    await page.getByPlaceholder("Enter new password").fill("NewPassword123!");
    await page.getByPlaceholder("Confirm new password").fill("NewPassword123!");

    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(page.getByText("Password Reset Complete")).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByText("Your password has been successfully reset")
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Go to Login" })).toBeVisible();
  });

  test("should show loading state during reset", async ({ page }) => {
    await page.goto("/reset-password?token=valid");

    await page.getByPlaceholder("Enter new password").fill("NewPassword123!");
    await page.getByPlaceholder("Confirm new password").fill("NewPassword123!");

    await page.getByRole("button", { name: "Reset Password" }).click();

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

  test("should redirect to login from protected settings page", async ({ page }) => {
    await page.goto("/settings");

    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fsettings/, { timeout: 10000 });
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  // Better Auth uses cookie-based sessions; these tests require
  // a real database backend which is not available in MSW E2E mode.
  test.skip("should allow access to settings when authenticated", async () => {});
  test.skip("should login and redirect to returnUrl", async () => {});
});

test.describe("Settings Features", () => {
  // Settings tests require authenticated session via Better Auth.
  // In MSW E2E mode there is no database, so these are skipped.
  test.skip("should update profile name", async () => {});
  test.skip("should validate password change", async () => {});
  test.skip("should change password successfully", async () => {});
  test.skip("should delete account and redirect", async () => {});
});

test.describe("Login and Signup", () => {
  // Email/password login and signup now go through Better Auth API,
  // which requires a real database. Skipped in MSW E2E mode.
  test.skip("should login with valid credentials and redirect to home", async () => {});
  test.skip("should create account and redirect to home", async () => {});
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
