import { test, expect } from "@playwright/test";

test.describe("Health Check Endpoint", () => {
  test("should return healthy status with Redis up", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);

    const health = await response.json();

    // Verify overall status
    expect(health.status).toBe("healthy");

    // Verify services
    expect(health.services).toBeDefined();
    expect(health.services.app).toBe("ok");
    expect(health.services.redis).toBe("up");

    // Verify Redis details
    expect(health.details).toBeDefined();
    expect(health.details.redis).toBeDefined();
    expect(health.details.redis.latencyMs).toBeDefined();
    expect(typeof health.details.redis.latencyMs).toBe("number");

    // Verify timestamp
    expect(health.timestamp).toBeDefined();
    expect(new Date(health.timestamp).getTime()).not.toBeNaN();

    // Verify uptime
    expect(health.uptime).toBeDefined();
    expect(typeof health.uptime).toBe("number");
    expect(health.uptime).toBeGreaterThan(0);
  });

  test("should have correct content-type header", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.headers()["content-type"]).toContain("application/json");
  });
});
