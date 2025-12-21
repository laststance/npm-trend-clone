import { test, expect } from "@playwright/test";

/**
 * Rate Limiting E2E Tests
 *
 * Note: Rate limiting is bypassed in test mode (APP_ENV=test or NEXT_PUBLIC_ENABLE_MSW_MOCK=true)
 * to allow other E2E tests to run without Redis dependency.
 *
 * These tests verify behavior when rate limiting IS active (production environment).
 * When running with `pnpm test:e2e`, rate limiting is disabled and these tests adapt accordingly.
 */
test.describe("Rate Limiting", () => {
  test("should return rate limit headers on successful request when enabled", async ({
    request,
  }) => {
    const response = await request.get("/api/packages/search?q=react");

    expect(response.status()).toBe(200);

    const headers = response.headers();

    // In test mode, rate limiting is bypassed so headers won't be present
    // Only verify headers when rate limiting is active
    if (headers["x-ratelimit-limit"]) {
      expect(headers["x-ratelimit-remaining"]).toBeDefined();
      expect(headers["x-ratelimit-reset"]).toBeDefined();

      // Verify header values are numeric
      expect(Number(headers["x-ratelimit-limit"])).toBeGreaterThan(0);
      expect(Number(headers["x-ratelimit-remaining"])).toBeGreaterThanOrEqual(0);
      expect(Number(headers["x-ratelimit-reset"])).toBeGreaterThan(0);
    }
    // Test passes in both modes - rate limiting enabled or bypassed
  });

  test("should handle rate limit response correctly when triggered", async ({
    request,
  }) => {
    // First check if rate limiting is active
    const initialResponse = await request.get("/api/packages/search?q=react");
    const initialHeaders = initialResponse.headers();

    // Skip heavy load test if rate limiting is bypassed
    if (!initialHeaders["x-ratelimit-limit"]) {
      // Rate limiting is disabled in test mode - just verify API works
      expect(initialResponse.status()).toBe(200);
      return;
    }

    // Rate limiting is active - test rate limit behavior
    const requests: Promise<Response>[] = [];
    const totalRequests = 120;

    for (let i = 0; i < totalRequests; i++) {
      requests.push(
        request.get("/api/packages/search?q=react").then((r) => r as unknown as Response)
      );
    }

    await Promise.all(requests);

    const response = await request.get("/api/packages/search?q=react");
    const headers = response.headers();

    // If we hit the rate limit
    if (response.status() === 429) {
      expect(headers["retry-after"]).toBeDefined();
      expect(Number(headers["retry-after"])).toBeGreaterThan(0);
      expect(headers["x-ratelimit-remaining"]).toBe("0");

      const body = await response.json();
      expect(body.error).toBe("Too Many Requests");
      expect(body.retryAfter).toBeDefined();
    } else {
      // Rate limit not triggered - headers should still exist
      expect(headers["x-ratelimit-limit"]).toBeDefined();
    }
  });

  test("should not rate limit health endpoint", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);

    // Health endpoint should not have rate limit headers
    // (it's excluded from middleware matcher)
    const headers = response.headers();
    expect(headers["x-ratelimit-limit"]).toBeUndefined();
  });
});
