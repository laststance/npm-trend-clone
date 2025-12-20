"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/**
 * Demo user type for frontend demonstration.
 */
interface DemoUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Auth context state and methods.
 */
interface AuthContextType {
  /** Current user (null if not logged in) */
  user: DemoUser | null;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Demo login function */
  login: (email: string, password: string) => Promise<boolean>;
  /** Demo signup function */
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  /** Logout function */
  logout: () => void;
}

const STORAGE_KEY = "npm-trend-demo-auth";

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Auth provider component.
 * Provides demo authentication state using localStorage.
 * In production, this would connect to a real auth backend.
 */
/**
 * Reads user from localStorage.
 * Returns null if not found or invalid.
 */
function readUserFromStorage(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as DemoUser;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // User state - initialized from localStorage on client
  // Using a function initializer to avoid reading localStorage on every render
  const [user, setUser] = useState<DemoUser | null>(() => readUserFromStorage());

  // Track mount state for hydration
  // Start as true on both server and client to avoid hydration mismatch
  // The actual loading is instant since we read localStorage synchronously in useState
  const isLoading = false;

  /**
   * Demo login - accepts any email with password "demo" or length >= 8.
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Demo validation: accept password "demo" or any 8+ char password
      if (password !== "demo" && password.length < 8) {
        return false;
      }

      const demoUser: DemoUser = {
        id: "demo-user-1",
        email,
        name: email.split("@")[0],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return true;
    },
    []
  );

  /**
   * Demo signup - creates a demo user.
   */
  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (password.length < 8) {
        return false;
      }

      const demoUser: DemoUser = {
        id: `demo-user-${Date.now()}`,
        email,
        name,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return true;
    },
    []
  );

  /**
   * Logout - clears auth state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout]
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
