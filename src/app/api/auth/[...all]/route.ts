import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API route handler.
 * Handles all authentication requests at /api/auth/*.
 *
 * @description
 * Endpoints include:
 * - POST /api/auth/sign-in/email - Email/password sign-in
 * - POST /api/auth/sign-up/email - Email/password registration
 * - POST /api/auth/sign-in/social - OAuth provider sign-in
 * - POST /api/auth/sign-out - End session
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/callback/:provider - OAuth callback handling
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */
export const { GET, POST } = toNextJsHandler(auth);
