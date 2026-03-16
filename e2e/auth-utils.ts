import type { Page, APIRequestContext } from "@playwright/test";
import pg from "pg";

export const TEST_EMAIL = "test@example.com";
export const TEST_PASSWORD = "testpassword123";
export const TEST_NAME = "Test User";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5433/npm_trend_clone";

/**
 * Logs in the seed test user via the login page UI.
 * Waits for redirect to the home page after successful login.
 */
export async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(TEST_EMAIL);
  await page.getByPlaceholder("Enter your password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/", { timeout: 10000 });
}

/**
 * Logs in via Better Auth API directly (faster than UI-based login).
 * Returns the response for cookie extraction.
 */
export async function loginViaAPI(request: APIRequestContext) {
  return request.post("/api/auth/sign-in/email", {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });
}

const AUTH_HEADERS = {
  Origin: "http://localhost:3000",
  "Content-Type": "application/json",
};

/**
 * Creates a throwaway user via the signup API.
 * Returns the email and password for subsequent operations.
 */
export async function createTempUser(request: APIRequestContext) {
  const email = `temp-${Date.now()}@example.com`;
  const password = "TempPassword123!";
  const name = "Temp User";

  await request.post("/api/auth/sign-up/email", {
    data: { email, password, name },
    headers: AUTH_HEADERS,
  });

  return { email, password, name };
}

/**
 * Requests a password reset via the API.
 * Returns the response for status checking.
 */
export async function requestPasswordReset(
  request: APIRequestContext,
  email: string
) {
  return request.post("/api/auth/request-password-reset", {
    data: { email, redirectTo: "/reset-password" },
    headers: AUTH_HEADERS,
  });
}

/**
 * Queries the verification table for the most recent password reset token.
 * The token is the suffix after "reset-password:" in the identifier column.
 */
export async function getLatestResetToken(): Promise<string | null> {
  const pool = new pg.Pool({ connectionString: DB_URL });
  try {
    const result = await pool.query(
      `SELECT REPLACE("identifier", 'reset-password:', '') as token FROM "verifications" WHERE "identifier" LIKE 'reset-password:%' ORDER BY "createdAt" DESC LIMIT 1`
    );
    return result.rows[0]?.token ?? null;
  } finally {
    await pool.end();
  }
}

/**
 * Deletes a user and their related data by email.
 * Used for cleanup after tests that create temporary users.
 */
export async function deleteUserByEmail(email: string) {
  const pool = new pg.Pool({ connectionString: DB_URL });
  try {
    await pool.query(`DELETE FROM "users" WHERE "email" = $1`, [email]);
  } finally {
    await pool.end();
  }
}
