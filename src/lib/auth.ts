import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma client instance for database operations.
 * Uses PrismaPg adapter with pg Pool for Neon PostgreSQL (required for Prisma 7.x).
 *
 * @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/postgres
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Better Auth server-side configuration.
 * Provides email/password and social OAuth authentication.
 *
 * @description
 * - Uses Prisma adapter for PostgreSQL database
 * - Supports GitHub and Google OAuth providers
 * - Email/password authentication enabled
 *
 * @see https://www.better-auth.com/docs
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  /**
   * Base URL for Better Auth.
   * Required for OAuth callback URLs to work correctly in production.
   * Falls back to BETTER_AUTH_URL env var, then VERCEL_URL for Vercel deployments.
   */
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),

  /**
   * Trusted origins for CORS and security.
   * Includes localhost for development and Vercel domains for production.
   */
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://npm-trend-clone.vercel.app",
    "https://*.vercel.app",
  ],

  /**
   * Email and password authentication configuration.
   * Allows users to sign up and sign in with email/password.
   */
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  /**
   * Social OAuth providers configuration.
   * GitHub and Google OAuth are enabled when environment variables are set.
   */
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  /**
   * Session configuration.
   */
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  /**
   * Base path for auth API routes.
   */
  basePath: "/api/auth",
});

/**
 * Type exports for auth session and user.
 */
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
