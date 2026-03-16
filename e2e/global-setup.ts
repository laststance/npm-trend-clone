import { execSync } from "child_process";

const LOCAL_DB_URL =
  "postgresql://postgres:postgres@localhost:5433/npm_trend_clone";

/**
 * Playwright global setup: ensures DB schema is current and seed data exists.
 * Requires Docker Compose PostgreSQL running on port 5433.
 */
export default async function globalSetup() {
  const env = {
    ...process.env,
    DATABASE_URL: LOCAL_DB_URL,
    RESEND_API_KEY: "",
  };

  console.log("[global-setup] Pushing schema and seeding database...");

  try {
    execSync("pnpm db:push", { stdio: "inherit", env });
    execSync("pnpm db:seed", { stdio: "inherit", env });
    console.log("[global-setup] Database ready.");
  } catch (error) {
    console.error("[global-setup] Database setup failed:", error);
    throw error;
  }
}
