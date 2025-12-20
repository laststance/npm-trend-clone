import { env } from "@/env";

/**
 * Determines whether MSW (Mock Service Worker) should be enabled.
 *
 * @description
 * Uses asymmetric logic for client and server:
 * - **Client**: Only checks `NEXT_PUBLIC_ENABLE_MSW_MOCK`
 * - **Server**: Requires BOTH `NEXT_PUBLIC_ENABLE_MSW_MOCK=true` AND (APP_ENV=test OR NODE_ENV=test)
 *
 * This double-check on server-side prevents accidental production activation
 * even if environment variables are misconfigured.
 *
 * @returns
 * - `true`: MSW should be enabled
 * - `false`: MSW should be disabled
 *
 * @example
 * // Client-side (browser)
 * isMSWEnabled() // checks NEXT_PUBLIC_ENABLE_MSW_MOCK only
 *
 * // Server-side (RSC/API Routes)
 * isMSWEnabled() // checks NEXT_PUBLIC_ENABLE_MSW_MOCK AND APP_ENV/NODE_ENV
 */
export function isMSWEnabled(): boolean {
  // Client-side: Only check public environment variable
  // Server-only variables (APP_ENV) are not accessible from client
  if (typeof window !== "undefined") {
    return env.NEXT_PUBLIC_ENABLE_MSW_MOCK === "true";
  }

  // Server-side: Double-check for safety
  // Even if NEXT_PUBLIC_ENABLE_MSW_MOCK=true, won't activate unless in test mode
  return (
    env.NEXT_PUBLIC_ENABLE_MSW_MOCK === "true" &&
    (env.APP_ENV === "test" || process.env.NODE_ENV === "test")
  );
}
