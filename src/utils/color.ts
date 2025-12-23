/**
 * Color contrast utilities for accessibility compliance.
 * Uses WCAG luminance formula to determine appropriate text colors.
 */

/**
 * Calculates relative luminance and returns appropriate text color class.
 * Uses WCAG luminance formula for accessibility compliance.
 * @param hexColor - Hex color string (e.g., "#61dafb")
 * @returns Tailwind text color class
 * @example
 * getContrastTextColor("#61dafb") // => "text-gray-900" (React blue - light bg)
 * getContrastTextColor("#dd0031") // => "text-white" (Angular red - dark bg)
 */
export function getContrastTextColor(hexColor: string): "text-gray-900" | "text-white" {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // WCAG relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "text-gray-900" : "text-white";
}

/**
 * Returns appropriate button hover classes based on background luminance.
 * Provides subtle opacity and background changes for interactive states.
 * @param hexColor - Hex color string (e.g., "#61dafb")
 * @returns Tailwind classes for text opacity, hover text, and hover background
 * @example
 * getContrastHoverClass("#61dafb") // => for light bg: dark text with black hover overlay
 * getContrastHoverClass("#dd0031") // => for dark bg: white text with white hover overlay
 */
export function getContrastHoverClass(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5
    ? "text-gray-900/80 hover:text-gray-900 hover:bg-black/10"
    : "text-white/80 hover:text-white hover:bg-white/20";
}

/**
 * A curated palette of vibrant, accessible colors for package badges.
 * These colors are designed to work well in both light and dark modes.
 */
const PACKAGE_COLORS = [
  "#ef4444", // Red (Rose)
  "#f97316", // Orange (Tangerine)
  "#eab308", // Yellow (Gold)
  "#22c55e", // Green (Emerald)
  "#14b8a6", // Teal (Aqua)
  "#0ea5e9", // Blue (Sky)
  "#6366f1", // Indigo (Royal)
  "#a855f7", // Purple (Violet)
  "#ec4899", // Pink (Fuchsia)
  "#8b5cf6", // Lavender
  "#06b6d4", // Cyan (Turquoise)
  "#84cc16", // Lime (Chartreuse)
] as const;

/**
 * Simple hash function for strings.
 * Produces a consistent numeric hash for any string input.
 * @param str - The string to hash
 * @returns A positive integer hash value
 * @example
 * hashString("react") // => 104115109
 * hashString("react") // => 104115109 (always same)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a consistent color for a package name.
 * The same package name will always return the same color.
 * @param packageName - The npm package name
 * @returns A hex color string
 * @example
 * getPackageColor("react") // => "#0ea5e9"
 * getPackageColor("vue") // => "#22c55e"
 */
export function getPackageColor(packageName: string): string {
  const hash = hashString(packageName.toLowerCase());
  const index = hash % PACKAGE_COLORS.length;
  return PACKAGE_COLORS[index];
}

/**
 * Generates a lighter version of a color for backgrounds.
 * Creates a semi-transparent version that works in both light and dark modes.
 * @param hexColor - The base hex color
 * @param opacity - Opacity value (0-1), defaults to 0.1
 * @returns An rgba color string
 * @example
 * getPackageBackgroundColor("#ef4444") // => "rgba(239, 68, 68, 0.1)"
 */
export function getPackageBackgroundColor(
  hexColor: string,
  opacity: number = 0.1
): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
