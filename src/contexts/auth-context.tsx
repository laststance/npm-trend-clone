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
 * Auth state interface for combined state management.
 */
interface AuthState {
  user: DemoUser | null;
  isLoading: boolean;
}

/**
 * Loads initial auth state from localStorage.
 * Pure function for state initialization.
 */
function loadInitialAuthState(): AuthState {
  // SSR check - localStorage not available on server
  if (typeof window === "undefined") {
    return { user: null, isLoading: true };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DemoUser;
      return { user: parsed, isLoading: false };
    }
  } catch {
    // Invalid stored data, clear it
    localStorage.removeItem(STORAGE_KEY);
  }

  return { user: null, isLoading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => loadInitialAuthState());
  const { user, isLoading } = authState;

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

      setAuthState({ user: demoUser, isLoading: false });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
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

      setAuthState({ user: demoUser, isLoading: false });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      return true;
    },
    []
  );

  /**
   * Logout - clears auth state.
   */
  const logout = useCallback(() => {
    setAuthState({ user: null, isLoading: false });
    localStorage.removeItem(STORAGE_KEY);
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
