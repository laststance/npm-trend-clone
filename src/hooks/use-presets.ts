"use client";

import { useState, useCallback } from "react";

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
 * Preset data structure.
 */
export interface Preset {
  id: string;
  name: string;
  packages: string[];
  createdAt: number;
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
 * Custom hook for managing presets in localStorage.
 * Supports saving, loading, deleting, and renaming presets.
 *
 * @returns Preset management functions and state
 * @example
 * const { presets, savePreset, loadPreset, deletePreset } = usePresets();
 */
export function usePresets() {
  // Use lazy initialization to load from localStorage
  const [presets, setPresets] = useState<Preset[]>(loadPresetsFromStorage);

  /**
   * Persist presets to localStorage.
   */
  const persistPresets = useCallback((newPresets: Preset[]) => {
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
    (
      name: string,
      packages: string[]
    ): { preset?: Preset; error?: string } => {
      // Validate name
      const nameError = validateName(name);
      if (nameError) {
        return { error: nameError };
      }

      // Check max presets
      if (presets.length >= MAX_PRESETS) {
        return { error: `Maximum ${MAX_PRESETS} presets allowed` };
      }

      // Create new preset
      const preset: Preset = {
        id: crypto.randomUUID(),
        name: name.trim(),
        packages,
        createdAt: Date.now(),
      };

      const newPresets = [preset, ...presets];
      setPresets(newPresets);
      persistPresets(newPresets);

      return { preset };
    },
    [presets, validateName, persistPresets]
  );

  /**
   * Deletes a preset by ID.
   */
  const deletePreset = useCallback(
    (id: string): boolean => {
      const index = presets.findIndex((p) => p.id === id);
      if (index === -1) return false;

      const newPresets = presets.filter((p) => p.id !== id);
      setPresets(newPresets);
      persistPresets(newPresets);

      return true;
    },
    [presets, persistPresets]
  );

  /**
   * Renames a preset.
   * @returns Error message or null if successful
   */
  const renamePreset = useCallback(
    (id: string, newName: string): string | null => {
      // Validate name
      const nameError = validateName(newName, id);
      if (nameError) {
        return nameError;
      }

      const newPresets = presets.map((p) =>
        p.id === id ? { ...p, name: newName.trim() } : p
      );
      setPresets(newPresets);
      persistPresets(newPresets);

      return null;
    },
    [presets, validateName, persistPresets]
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

  return {
    presets,
    savePreset,
    deletePreset,
    renamePreset,
    getPreset,
    validateName,
    maxPresets: MAX_PRESETS,
    maxNameLength: MAX_NAME_LENGTH,
  };
}
