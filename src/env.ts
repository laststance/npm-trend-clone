import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe environment variable schema for the application.
 *
 * @description
 * - Server variables: Only available server-side (APP_ENV, NODE_ENV)
 * - Client variables: Available client-side, must use NEXT_PUBLIC_ prefix
 *
 * @example
 * // Usage
 * import { env } from '@/env';
 * console.log(env.NEXT_PUBLIC_ENABLE_MSW_MOCK); // 'true' | 'false'
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    /** Custom environment identifier for distinguishing test builds from production */
    APP_ENV: z.enum(["development", "test"]).optional(),
  },
  client: {
    /**
     * Flag to enable MSW mocking.
     * Must be explicitly set to 'true' to enable.
     */
    NEXT_PUBLIC_ENABLE_MSW_MOCK: z
      .enum(["true", "false"])
      .optional()
      .default("false"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    NEXT_PUBLIC_ENABLE_MSW_MOCK: process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK,
  },
  /**
   * Skip validation in environments where env vars may not be available
   * (e.g., CI/CD build steps)
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
