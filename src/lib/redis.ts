import { Redis } from "@upstash/redis";

/**
 * Upstash Redis client instance.
 * Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from environment variables.
 *
 * @returns Redis client configured for the Upstash REST API
 */
export const redis = Redis.fromEnv();

/**
 * Check if Redis connection is healthy by executing a PING command.
 *
 * @returns
 * - When connected: { status: "up", latencyMs: number }
 * - When connection fails: { status: "down", error: string }
 *
 * @example
 * const health = await checkRedisHealth();
 * // => { status: "up", latencyMs: 42 }
 */
export async function checkRedisHealth(): Promise<
  { status: "up"; latencyMs: number } | { status: "down"; error: string }
> {
  const start = Date.now();

  try {
    const result = await redis.ping();

    if (result === "PONG") {
      return {
        status: "up",
        latencyMs: Date.now() - start,
      };
    }

    return {
      status: "down",
      error: `Unexpected PING response: ${result}`,
    };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
