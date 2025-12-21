"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client-side configuration.
 * Provides React hooks and methods for authentication.
 *
 * @description
 * - useSession: Hook to get current session state
 * - signIn: Methods for email/password and social OAuth sign-in
 * - signUp: Method for email/password registration
 * - signOut: Method to end the current session
 *
 * @example
 * ```tsx
 * // Get session state
 * const { data: session, isPending } = authClient.useSession();
 *
 * // Sign in with GitHub OAuth
 * await authClient.signIn.social({ provider: "github" });
 *
 * // Sign in with email/password
 * await authClient.signIn.email({ email, password });
 *
 * // Sign out
 * await authClient.signOut();
 * ```
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

/**
 * Convenience exports for common auth operations.
 */
export const { useSession, signIn, signUp, signOut } = authClient;
