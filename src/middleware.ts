import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter using Upstash Redis with sliding window algorithm.
 * Limits: 100 requests per 10 seconds per IP address.
 *
 * @description
 * Uses sliding window for accurate rate limiting without burst issues.
 * Ephemeral cache reduces Redis calls for hot IPs.
 */
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "10 s"),
  ephemeralCache: new Map(),
  analytics: true,
  prefix: "npm-trend-ratelimit",
});

/**
 * Extracts client IP address from request headers.
 * Falls back to 127.0.0.1 for local development.
 */
function getClientIp(request: NextRequest): string {
  // Check common proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  // Fallback for local development
  // Note: request.ip is available in Vercel edge runtime but not in all environments
  return "127.0.0.1";
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request);

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    // Calculate seconds until reset
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(limit));
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("X-RateLimit-Reset", String(reset));

    return response;
  } catch (error) {
    // If Redis is unavailable, allow request to proceed (fail-open)
    console.error("Rate limiting error:", error);
    return NextResponse.next();
  }
}

/**
 * Apply rate limiting to API routes, excluding health check.
 * Health check must remain unthrottled for monitoring systems.
 */
export const config = {
  matcher: [
    "/api/downloads/:path*",
    "/api/packages/:path*",
  ],
};
