import { NextResponse } from "next/server";
import { checkRedisHealth } from "@/lib/redis";

/**
 * Health check endpoint.
 * Returns the application health status including Redis connectivity.
 * GET /api/health
 *
 * @returns
 * - status: "healthy" when all services are operational
 * - services.redis: "up" when Redis PING succeeds, "down" otherwise
 *
 * @example
 * // Response when Redis is connected:
 * {
 *   "status": "healthy",
 *   "timestamp": "2025-12-21T...",
 *   "services": { "app": "ok", "redis": "up" },
 *   "uptime": 123.45
 * }
 */
export async function GET() {
  const redisHealth = await checkRedisHealth();

  const isHealthy = redisHealth.status === "up";

  const health = {
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      app: "ok",
      redis: redisHealth.status,
    },
    details: {
      redis:
        redisHealth.status === "up"
          ? { latencyMs: redisHealth.latencyMs }
          : { error: redisHealth.error },
    },
    uptime: process.uptime(),
  };

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  });
}
