"use client";

import { useState, useEffect } from "react";

/**
 * Gets the initial reduced motion preference.
 * Safe to call on server (returns false).
 */
function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Detects user's reduced motion preference from system settings.
 * Returns true when the user prefers reduced motion (accessibility setting).
 *
 * @returns Whether the user prefers reduced motion
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * <Line isAnimationActive={!prefersReducedMotion} />
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotion
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
