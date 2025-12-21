"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/auth-fetch";

/**
 * Maximum number of presets allowed per user.
 */
const MAX_PRESETS = 10;

/**
 * Maximum length for preset names.
 */
const MAX_NAME_LENGTH = 50;

/**
 * Local storage key for presets.
 */
const STORAGE_KEY = "npm-trends-presets";

/**
 * Preset data structure (localStorage format).
 */
export interface Preset {
  id: string;
  name: string;
  packages: string[];
  timeRange?: string;
  createdAt: number;
}

/**
 * Preset data structure from API.
 */
interface ApiPreset {
  id: string;
  name: string;
  packages: string[];
  timeRange: string;
  createdAt: string;
}

/**
 * Convert API preset to local format.
 */
function apiToLocal(apiPreset: ApiPreset): Preset {
  return {
    id: apiPreset.id,
    name: apiPreset.name,
    packages: apiPreset.packages,
    timeRange: apiPreset.timeRange,
    createdAt: new Date(apiPreset.createdAt).getTime(),
  };
}

/**
 * Load presets from localStorage.
 * @returns Sorted array of presets (newest first)
 */
function loadPresetsFromStorage(): Preset[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Preset[];
      // Sort by creation date (newest first)
      return parsed.sort((a, b) => b.createdAt - a.createdAt);
    }
  } catch (err) {
    console.error("Failed to load presets:", err);
  }
  return [];
}

/**
 * Custom hook for managing presets.
 * Supports both localStorage (anonymous) and cloud storage (authenticated users).
 *
 * @returns Preset management functions and state
 * @example
 * const { presets, savePreset, loadPreset, deletePreset, isLoading } = usePresets();
 */
export function usePresets() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const isAuthenticated = !!session?.user?.id;

  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch presets from API for authenticated users.
   */
  const fetchPresetsFromApi = useCallback(async () => {
    try {
      const response = await authFetch("/api/presets");
      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated, fall back to localStorage
          // Note: authFetch will redirect to login if 401
          return null;
        }
        throw new Error("Failed to fetch presets");
      }
      const data = (await response.json()) as ApiPreset[];
      return data.map(apiToLocal);
    } catch (err) {
      console.error("Failed to fetch presets from API:", err);
      return null;
    }
  }, []);

  /**
   * Load presets on mount and when authentication changes.
   */
  useEffect(() => {
    async function loadPresets() {
      setIsLoading(true);
      setError(null);

      if (isSessionLoading) {
        return; // Wait for session to load
      }

      if (isAuthenticated) {
        // Try to fetch from API
        const apiPresets = await fetchPresetsFromApi();
        if (apiPresets !== null) {
          setPresets(apiPresets);
        } else {
          // Fall back to localStorage if API fails
          setPresets(loadPresetsFromStorage());
        }
      } else {
        // Use localStorage for anonymous users
        setPresets(loadPresetsFromStorage());
      }

      setIsLoading(false);
    }

    loadPresets();
  }, [isAuthenticated, isSessionLoading, fetchPresetsFromApi]);

  /**
   * Persist presets to localStorage.
   */
  const persistToStorage = useCallback((newPresets: Preset[]) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
    } catch (err) {
      console.error("Failed to save presets:", err);
    }
  }, []);

  /**
   * Validates a preset name.
   * @returns Error message or null if valid
   */
  const validateName = useCallback(
    (name: string, excludeId?: string): string | null => {
      if (!name || name.trim().length === 0) {
        return "Preset name cannot be empty";
      }
      if (name.length > MAX_NAME_LENGTH) {
        return `Preset name must be ${MAX_NAME_LENGTH} characters or less`;
      }
      const duplicate = presets.find(
        (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== excludeId
      );
      if (duplicate) {
        return "A preset with this name already exists";
      }
      return null;
    },
    [presets]
  );

  /**
   * Saves a new preset.
   * @returns Created preset or error message
   */
  const savePreset = useCallback(
    async (
      name: string,
      packages: string[],
      timeRange: string = "1y"
    ): Promise<{ preset?: Preset; error?: string }> => {
      // Validate name
      const nameError = validateName(name);
      if (nameError) {
        return { error: nameError };
      }

      // Check max presets
      if (presets.length >= MAX_PRESETS) {
        return { error: `Maximum ${MAX_PRESETS} presets allowed` };
      }

      if (isAuthenticated) {
        // Save to API for authenticated users
        try {
          const response = await authFetch("/api/presets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, packages, timeRange }),
          });

          if (!response.ok) {
            const data = await response.json();
            return { error: data.error || "Failed to save preset" };
          }

          const apiPreset = (await response.json()) as ApiPreset;
          const preset = apiToLocal(apiPreset);
          setPresets((prev) => [preset, ...prev]);
          return { preset };
        } catch (err) {
          console.error("Failed to save preset to API:", err);
          return { error: "Failed to save preset" };
        }
      } else {
        // Save to localStorage for anonymous users
        const preset: Preset = {
          id: crypto.randomUUID(),
          name: name.trim(),
          packages,
          timeRange,
          createdAt: Date.now(),
        };

        const newPresets = [preset, ...presets];
        setPresets(newPresets);
        persistToStorage(newPresets);

        return { preset };
      }
    },
    [presets, validateName, isAuthenticated, persistToStorage]
  );

  /**
   * Deletes a preset by ID.
   */
  const deletePreset = useCallback(
    async (id: string): Promise<boolean> => {
      const index = presets.findIndex((p) => p.id === id);
      if (index === -1) return false;

      if (isAuthenticated) {
        // Delete from API for authenticated users
        try {
          const response = await authFetch(`/api/presets/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            console.error("Failed to delete preset from API");
            return false;
          }

          setPresets((prev) => prev.filter((p) => p.id !== id));
          return true;
        } catch (err) {
          console.error("Failed to delete preset from API:", err);
          return false;
        }
      } else {
        // Delete from localStorage for anonymous users
        const newPresets = presets.filter((p) => p.id !== id);
        setPresets(newPresets);
        persistToStorage(newPresets);
        return true;
      }
    },
    [presets, isAuthenticated, persistToStorage]
  );

  /**
   * Renames a preset.
   * @returns Error message or null if successful
   */
  const renamePreset = useCallback(
    async (id: string, newName: string): Promise<string | null> => {
      // Validate name
      const nameError = validateName(newName, id);
      if (nameError) {
        return nameError;
      }

      if (isAuthenticated) {
        // Update via API for authenticated users
        try {
          const response = await authFetch(`/api/presets/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
          });

          if (!response.ok) {
            const data = await response.json();
            return data.error || "Failed to rename preset";
          }

          setPresets((prev) =>
            prev.map((p) => (p.id === id ? { ...p, name: newName.trim() } : p))
          );
          return null;
        } catch (err) {
          console.error("Failed to rename preset via API:", err);
          return "Failed to rename preset";
        }
      } else {
        // Update localStorage for anonymous users
        const newPresets = presets.map((p) =>
          p.id === id ? { ...p, name: newName.trim() } : p
        );
        setPresets(newPresets);
        persistToStorage(newPresets);
        return null;
      }
    },
    [presets, validateName, isAuthenticated, persistToStorage]
  );

  /**
   * Gets a preset by ID.
   */
  const getPreset = useCallback(
    (id: string): Preset | undefined => {
      return presets.find((p) => p.id === id);
    },
    [presets]
  );

  /**
   * Refresh presets from the server (for authenticated users).
   */
  const refreshPresets = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const apiPresets = await fetchPresetsFromApi();
    if (apiPresets !== null) {
      setPresets(apiPresets);
    }
    setIsLoading(false);
  }, [isAuthenticated, fetchPresetsFromApi]);

  return {
    presets,
    savePreset,
    deletePreset,
    renamePreset,
    getPreset,
    validateName,
    refreshPresets,
    isLoading: isLoading || isSessionLoading,
    isAuthenticated,
    error,
    maxPresets: MAX_PRESETS,
    maxNameLength: MAX_NAME_LENGTH,
  };
}
