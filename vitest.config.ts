import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest configuration for unit tests.
 *
 * @description
 * - Excludes e2e tests (handled by Playwright)
 * - Excludes node_modules and build outputs
 * - Sets up path aliases matching tsconfig
 */
export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**",
      "**/.next/**",
      "**/storybook-static/**",
    ],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
