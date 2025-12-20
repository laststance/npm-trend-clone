/**
 * Default color palette for package comparison charts.
 * Colors are designed to be distinguishable and accessible.
 */
export const CHART_COLORS = [
  "#61dafb", // React blue
  "#42b883", // Vue green
  "#dd0031", // Angular red
  "#ff3e00", // Svelte orange
  "#2c4f7c", // Solid blue
  "#673ab8", // Preact purple
] as const;

/**
 * Get a color from the palette by index.
 * @param index - Index of the package in the comparison list
 * @returns Color hex string
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Maximum number of packages that can be compared simultaneously.
 */
export const MAX_PACKAGES = 6;
