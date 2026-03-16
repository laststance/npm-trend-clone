"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { authClient, useSession } from "@/lib/auth-client";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<boolean>;
  deleteAccount: (password?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Auth provider that wraps Better Auth's session management.
 * Provides a unified interface for login, signup, logout, and account management.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const user: AuthUser | null = useMemo(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
  }, [session]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        return { success: false, error: error.message ?? "Sign in failed" };
      }
      return { success: true };
    },
    []
  );

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) {
        return { success: false, error: error.message ?? "Sign up failed" };
      }
      return { success: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await authClient.signOut();
  }, []);

  const updateName = useCallback(async (newName: string): Promise<boolean> => {
    const { error } = await authClient.updateUser({ name: newName });
    return !error;
  }, []);

  const deleteAccount = useCallback(async (password?: string): Promise<boolean> => {
    const { error } = await authClient.deleteUser({
      password: password ?? "",
    });
    return !error;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading: isPending,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateName,
      deleteAccount,
    }),
    [user, isPending, login, signup, logout, updateName, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
