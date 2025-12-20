import { NextResponse } from "next/server";

/**
 * Health check endpoint.
 * Returns the application health status.
 * GET /api/health
 */
export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      app: "ok",
      redis: "not_configured", // Redis integration not yet implemented
    },
    uptime: process.uptime(),
  };

  return NextResponse.json(health);
}
