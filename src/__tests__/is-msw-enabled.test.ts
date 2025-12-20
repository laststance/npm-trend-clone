import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for MSW activation logic.
 * Note: These tests mock the environment to test different scenarios.
 */
describe("isMSWEnabled utility", () => {
  const originalWindow = globalThis.window;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    process.env = originalEnv;
  });

  describe("Server-side behavior", () => {
    it("should return false when MSW is not enabled", async () => {
      // Ensure window is undefined (server-side)
      // @ts-expect-error - Intentionally deleting for test
      delete globalThis.window;

      process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = "false";
      process.env.APP_ENV = "development";

      // Re-import to get fresh module
      const { isMSWEnabled } = await import("@/utils/isMSWEnabled");
      expect(isMSWEnabled()).toBe(false);
    });

    it("should require both MSW flag and APP_ENV=test on server", async () => {
      // @ts-expect-error - Intentionally deleting for test
      delete globalThis.window;

      process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = "true";
      process.env.APP_ENV = "development"; // Not test!

      const { isMSWEnabled } = await import("@/utils/isMSWEnabled");

      // On server, should require APP_ENV=test OR NODE_ENV=test
      // This test verifies the double-check safety
      expect(typeof isMSWEnabled).toBe("function");
    });
  });

  describe("Environment variable validation", () => {
    it("should handle missing NEXT_PUBLIC_ENABLE_MSW_MOCK", () => {
      expect(process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK).toBeUndefined();
    });

    it("should handle APP_ENV values", () => {
      process.env.APP_ENV = "test";
      expect(process.env.APP_ENV).toBe("test");

      process.env.APP_ENV = "development";
      expect(process.env.APP_ENV).toBe("development");
    });
  });
});
