import { test, expect } from "@playwright/test";
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  loginAsTestUser,
  createTempUser,
  requestPasswordReset,
  getLatestResetToken,
  deleteUserByEmail,
} from "./auth-utils";

test.describe("Password Reset", () => {
  test("should show error for error query param", async ({ page }) => {
    await page.goto("/reset-password?error=INVALID_TOKEN");

    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
    await expect(
      page.getByText("This password reset link is invalid or has expired")
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Request New Link" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to login" })).toBeVisible();
  });

  test("should show error when no token provided", async ({ page }) => {
    await page.goto("/reset-password");

    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
  });

  test("should show reset form when token is present", async ({ page }) => {
    await page.goto("/reset-password?token=any-token-string");

    await expect(page.getByText("Reset Your Password")).toBeVisible();
    await expect(page.getByText("Enter your new password below")).toBeVisible();

    await expect(page.getByPlaceholder("Enter new password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm new password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Reset Password" })
    ).toBeVisible();
  });

  test("should validate password requirements", async ({ page }) => {
    await page.goto("/reset-password?token=test-token");

    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("should validate password length", async ({ page }) => {
    await page.goto("/reset-password?token=test-token");

    await page.getByPlaceholder("Enter new password").fill("short");
    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("should validate password confirmation", async ({ page }) => {
    await page.goto("/reset-password?token=test-token");

    await page.getByPlaceholder("Enter new password").fill("Password123!");
    await page.getByPlaceholder("Confirm new password").fill("DifferentPassword!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("should complete password reset with real token", async ({ page, request }) => {
    const tempUser = await createTempUser(request);

    const resetResponse = await requestPasswordReset(request, tempUser.email);
    expect(resetResponse.ok()).toBeTruthy();

    await page.waitForTimeout(1000);

    const token = await getLatestResetToken();
    expect(token).toBeTruthy();

    await page.goto(`/reset-password?token=${token}`);
    await expect(page.getByText("Reset Your Password")).toBeVisible();

    const newPassword = "ResetPassword456!";
    await page.getByPlaceholder("Enter new password").fill(newPassword);
    await page.getByPlaceholder("Confirm new password").fill(newPassword);

    await page.getByRole("button", { name: "Reset Password" }).click();

    await expect(page.getByText("Password Reset Complete")).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText("Your password has been successfully reset")
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Go to Login" })).toBeVisible();

    await deleteUserByEmail(tempUser.email);
  });
});

test.describe("Email Verification", () => {
  test("should show success state by default", async ({ page }) => {
    await page.goto("/verify-email");

    await expect(page.getByText("Email Verified")).toBeVisible();
    await expect(
      page.getByText("Your email address has been successfully verified")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to Home" })).toBeVisible();
  });

  test("should show error state for error query param", async ({ page }) => {
    await page.goto("/verify-email?error=INVALID_TOKEN");

    await expect(page.getByText("Verification Failed")).toBeVisible();
    await expect(
      page.getByText("The verification link is invalid or has expired")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to Settings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to login" })).toBeVisible();
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

  test("should allow access to settings when authenticated", async ({ page }) => {
    await loginAsTestUser(page);

    await page.goto("/settings");

    await expect(page.getByText("Account Settings")).toBeVisible();
    await expect(page.getByText("Profile", { exact: true })).toBeVisible();
  });

  test("should login and redirect to returnUrl", async ({ page }) => {
    await page.goto("/login?returnUrl=%2Fsettings");

    await page.getByPlaceholder("you@example.com").fill(TEST_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/settings/, { timeout: 10000 });
    await expect(page.getByText("Account Settings")).toBeVisible();
  });
});

test.describe("Settings Features", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/settings");
    await expect(page.getByText("Account Settings")).toBeVisible();
  });

  test("should update profile name", async ({ page }) => {
    const originalName = "Test User";
    const newName = "Updated Name";

    const nameInput = page.locator("#name");
    await nameInput.clear();
    await nameInput.fill(newName);
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByText("Profile updated")).toBeVisible({ timeout: 5000 });

    await nameInput.clear();
    await nameInput.fill(originalName);
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByText("Profile updated")).toBeVisible({ timeout: 5000 });
  });

  test("should validate password change", async ({ page }) => {
    await page.locator("#currentPassword").fill("currentpass");
    await page.locator("#newPassword").fill("short");
    await page.locator("#confirmNewPassword").fill("short");

    await page
      .getByRole("button", { name: "Change Password" })
      .click();

    await expect(
      page.getByText("New password must be at least 8 characters")
    ).toBeVisible({ timeout: 5000 });
  });

  test("should change password successfully", async ({ page, request }) => {
    const tempUser = await createTempUser(request);

    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(tempUser.email);
    await page.getByPlaceholder("Enter your password").fill(tempUser.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/settings");
    await expect(page.getByText("Account Settings")).toBeVisible();

    const newPassword = "ChangedPassword789!";
    await page.locator("#currentPassword").fill(tempUser.password);
    await page.locator("#newPassword").fill(newPassword);
    await page.locator("#confirmNewPassword").fill(newPassword);

    await page.getByRole("button", { name: "Change Password" }).click();

    await expect(page.getByText("Password changed")).toBeVisible({ timeout: 5000 });

    await deleteUserByEmail(tempUser.email);
  });

  test("should delete account and redirect", async ({ page, request }) => {
    const tempUser = await createTempUser(request);

    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(tempUser.email);
    await page.getByPlaceholder("Enter your password").fill(tempUser.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/settings");
    await expect(page.getByText("Account Settings")).toBeVisible();

    await page.getByRole("button", { name: "Delete Account" }).first().click();

    await expect(page.getByText("Are you absolutely sure?")).toBeVisible();
    await page.locator("#deletePassword").fill(tempUser.password);
    await page
      .getByRole("button", { name: "Delete Account" })
      .last()
      .click();

    await expect(page).toHaveURL("/", { timeout: 10000 });
  });
});

test.describe("Login and Signup", () => {
  test("should login with valid credentials and redirect to home", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("you@example.com").fill(TEST_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("should create account and redirect to home", async ({ page }) => {
    const email = `signup-${Date.now()}@example.com`;
    const password = "SignupTest123!";

    await page.goto("/signup");

    await page.getByPlaceholder("Your name").fill("New User");
    await page.getByPlaceholder("you@example.com").fill(email);
    await page.getByPlaceholder("Create a password").fill(password);
    await page.getByPlaceholder("Confirm your password").fill(password);

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL("/", { timeout: 10000 });

    await deleteUserByEmail(email);
  });
});

