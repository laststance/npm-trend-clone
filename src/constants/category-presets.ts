/**
 * Category presets for the "Discover packages" feature.
 * Each category maps to a list of popular npm packages in that domain.
 */
export const CATEGORY_PRESETS: Record<string, string[]> = {
  "Front-end": ["react", "vue", "angular", "svelte"],
  "Back-end": ["express", "fastify", "nest", "koa"],
  CLI: ["commander", "inquirer", "chalk", "ora"],
  Documentation: ["jsdoc", "typedoc", "docusaurus"],
  CSS: ["tailwindcss", "sass", "postcss", "styled-components"],
  Testing: ["jest", "vitest", "mocha", "cypress"],
  IoT: ["johnny-five", "mqtt", "serialport"],
  Coverage: ["istanbul", "c8", "nyc"],
  Mobile: ["react-native", "expo", "capacitor"],
  Frameworks: ["next", "nuxt", "remix", "astro"],
  Robotics: ["robotjs", "cylon"],
  Math: ["mathjs", "decimal.js", "bignumber.js"],
} as const;

/**
 * Type for category names.
 */
export type CategoryName = keyof typeof CATEGORY_PRESETS;

