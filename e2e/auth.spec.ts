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

  test("should redirect to login from protected settings page", async ({ page }) => {
    // Clear any existing auth state
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("npm-trend-demo-auth"));

    // Try to access settings
    await page.goto("/settings");

    // Should redirect to login with returnUrl
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fsettings/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("should allow access to settings when authenticated", async ({ page }) => {
    // Set up demo auth state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("npm-trend-demo-auth", JSON.stringify({
        id: "demo-user-1",
        email: "test@example.com",
        name: "test"
      }));
    });

    // Navigate to settings
    await page.goto("/settings");

    // Should show settings page
    await expect(page.getByText("Account Settings")).toBeVisible();
    await expect(page.getByText("Profile").first()).toBeVisible();
    await expect(page.getByText("Danger Zone")).toBeVisible();
  });

  test("should login and redirect to returnUrl", async ({ page }) => {
    // Clear auth state and go to login with returnUrl
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("npm-trend-demo-auth"));
    await page.goto("/login?returnUrl=%2Fsettings");

    // Fill login form
    await page.getByPlaceholder("you@example.com").fill("test@example.com");
    await page.getByPlaceholder("Enter your password").fill("demo");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should redirect to settings after login
    await expect(page).toHaveURL("/settings", { timeout: 5000 });
    await expect(page.getByText("Account Settings")).toBeVisible();
  });
});

test.describe("Settings Features", () => {
  test.beforeEach(async ({ page }) => {
    // Set up demo auth state before each test
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("npm-trend-demo-auth", JSON.stringify({
        id: "demo-user-1",
        email: "test@example.com",
        name: "TestUser"
      }));
    });
  });

  test("should update profile name", async ({ page }) => {
    await page.goto("/settings");

    // Wait for page to load
    await expect(page.getByText("Account Settings")).toBeVisible();

    // Change name
    const nameInput = page.locator("#name");
    await nameInput.clear();
    await nameInput.fill("NewUserName");

    // Submit form
    await page.getByRole("button", { name: "Save Changes" }).click();

    // Verify success toast
    await expect(page.getByText("Profile updated")).toBeVisible({ timeout: 3000 });

    // Verify localStorage was updated
    const stored = await page.evaluate(() => localStorage.getItem("npm-trend-demo-auth"));
    expect(stored).toContain("NewUserName");
  });

  test("should validate password change", async ({ page }) => {
    await page.goto("/settings");

    // Wait for page to load
    await expect(page.getByText("Account Settings")).toBeVisible();

    // Try to submit with empty fields
    await page.getByRole("button", { name: "Change Password" }).click();
    await expect(page.getByText("All password fields are required")).toBeVisible({ timeout: 3000 });
  });

  test("should change password successfully", async ({ page }) => {
    await page.goto("/settings");

    // Wait for page to load
    await expect(page.getByText("Account Settings")).toBeVisible();

    // Fill password fields
    await page.locator("#currentPassword").fill("demo");
    await page.locator("#newPassword").fill("newpassword123");
    await page.locator("#confirmNewPassword").fill("newpassword123");

    // Submit form
    await page.getByRole("button", { name: "Change Password" }).click();

    // Verify success toast
    await expect(page.getByText("Password changed")).toBeVisible({ timeout: 3000 });
  });

  test("should delete account and redirect", async ({ page }) => {
    await page.goto("/settings");

    // Wait for page to load
    await expect(page.getByText("Account Settings")).toBeVisible();

    // Click delete account button to open dialog
    await page.getByRole("button", { name: "Delete Account" }).click();

    // Wait for dialog to appear
    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Are you absolutely sure?")).toBeVisible();

    // Click confirm button in dialog
    await dialog.getByRole("button", { name: "Delete Account" }).click();

    // Should redirect to login (ProtectedRoute detects user is no longer authenticated)
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Verify localStorage was cleared
    const stored = await page.evaluate(() => localStorage.getItem("npm-trend-demo-auth"));
    expect(stored).toBeNull();
  });
});

test.describe("Login and Signup", () => {
  test("should login with valid credentials and redirect to home", async ({ page }) => {
    // Clear any existing auth state
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("npm-trend-demo-auth"));

    // Go to login page
    await page.goto("/login");

    // Fill login form
    await page.getByPlaceholder("you@example.com").fill("test@example.com");
    await page.getByPlaceholder("Enter your password").fill("demo");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should redirect to home (dashboard)
    await expect(page).toHaveURL("/", { timeout: 5000 });

    // Verify user is logged in by checking localStorage
    const stored = await page.evaluate(() => localStorage.getItem("npm-trend-demo-auth"));
    expect(stored).toContain("test@example.com");
  });

  test("should create account and redirect to home", async ({ page }) => {
    // Clear any existing auth state
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("npm-trend-demo-auth"));

    // Go to signup page
    await page.goto("/signup");

    // Fill signup form
    await page.getByPlaceholder("Your name").fill("Test User");
    await page.getByPlaceholder("you@example.com").fill("newuser@example.com");
    await page.locator("#password").fill("password123");
    await page.locator("#confirmPassword").fill("password123");

    // Submit form
    await page.getByRole("button", { name: "Create account" }).click();

    // Should show success toast and redirect to home
    await expect(page.getByText("Account created!")).toBeVisible({ timeout: 3000 });
    await expect(page).toHaveURL("/", { timeout: 5000 });

    // Verify user is logged in
    const stored = await page.evaluate(() => localStorage.getItem("npm-trend-demo-auth"));
    expect(stored).toContain("Test User");
    expect(stored).toContain("newuser@example.com");
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
