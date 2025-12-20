/**
 * Mock package info data for e2e testing.
 * Provides realistic package metadata responses.
 */

import type { PackageInfo } from "@/types/package";

/**
 * Mock package info for popular packages.
 * Based on real npm registry data (captured 2025-12).
 */
export const packageInfoFixtures: Record<string, PackageInfo> = {
  react: {
    name: "react",
    description: "The library for web and native user interfaces.",
    version: "19.2.3",
    license: "MIT",
    homepage: "https://react.dev/",
    repositoryUrl: "https://github.com/facebook/react",
    lastPublished: "2025-12-01T00:00:00.000Z",
    weeklyDownloads: 25000000,
    githubStars: 230000,
  },
  vue: {
    name: "vue",
    description:
      "The progressive JavaScript framework for building modern web UI.",
    version: "3.5.13",
    license: "MIT",
    homepage: "https://vuejs.org",
    repositoryUrl: "https://github.com/vuejs/core",
    lastPublished: "2025-11-15T00:00:00.000Z",
    weeklyDownloads: 5000000,
    githubStars: 47000,
  },
  angular: {
    name: "@angular/core",
    description: "Angular - the core framework",
    version: "19.1.0",
    license: "MIT",
    homepage: "https://angular.dev",
    repositoryUrl: "https://github.com/angular/angular",
    lastPublished: "2025-12-10T00:00:00.000Z",
    weeklyDownloads: 3000000,
    githubStars: 96000,
  },
  svelte: {
    name: "svelte",
    description: "Cybernetically enhanced web apps",
    version: "5.17.0",
    license: "MIT",
    homepage: "https://svelte.dev",
    repositoryUrl: "https://github.com/sveltejs/svelte",
    lastPublished: "2025-12-18T00:00:00.000Z",
    weeklyDownloads: 1200000,
    githubStars: 82000,
  },
  typescript: {
    name: "typescript",
    description:
      "TypeScript is a language for application scale JavaScript development",
    version: "5.9.3",
    license: "Apache-2.0",
    homepage: "https://www.typescriptlang.org/",
    repositoryUrl: "https://github.com/Microsoft/TypeScript",
    lastPublished: "2025-12-05T00:00:00.000Z",
    weeklyDownloads: 50000000,
    githubStars: 103000,
  },
  lodash: {
    name: "lodash",
    description: "Lodash modular utilities.",
    version: "4.17.21",
    license: "MIT",
    homepage: "https://lodash.com/",
    repositoryUrl: "https://github.com/lodash/lodash",
    lastPublished: "2021-02-20T00:00:00.000Z",
    weeklyDownloads: 45000000,
    githubStars: 60000,
  },
  express: {
    name: "express",
    description: "Fast, unopinionated, minimalist web framework",
    version: "5.1.0",
    license: "MIT",
    homepage: "https://expressjs.com/",
    repositoryUrl: "https://github.com/expressjs/express",
    lastPublished: "2025-12-01T00:00:00.000Z",
    weeklyDownloads: 35000000,
    githubStars: 65000,
  },
  axios: {
    name: "axios",
    description: "Promise based HTTP client for the browser and node.js",
    version: "1.8.1",
    license: "MIT",
    homepage: "https://axios-http.com",
    repositoryUrl: "https://github.com/axios/axios",
    lastPublished: "2025-11-20T00:00:00.000Z",
    weeklyDownloads: 45000000,
    githubStars: 106000,
  },
};

/**
 * Generates mock package info for unknown packages.
 * Creates realistic looking data based on package name.
 * @param name - Package name
 * @returns Mock package info
 */
export function generateMockPackageInfo(name: string): PackageInfo {
  // Generate semi-random but consistent values based on package name
  const nameHash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseDownloads = (nameHash * 1000) % 10000000;
  const baseStars = (nameHash * 10) % 50000;

  return {
    name,
    description: `A package for ${name.replace(/-/g, " ")} functionality`,
    version: `${(nameHash % 10)}.${(nameHash % 20)}.${nameHash % 30}`,
    license: nameHash % 2 === 0 ? "MIT" : "Apache-2.0",
    homepage: `https://www.npmjs.com/package/${name}`,
    repositoryUrl: `https://github.com/npm/${name}`,
    lastPublished: new Date(Date.now() - (nameHash % 365) * 24 * 60 * 60 * 1000).toISOString(),
    weeklyDownloads: baseDownloads,
    githubStars: baseStars,
  };
}

/**
 * Gets package info for a given package name.
 * Returns fixture data if available, otherwise generates mock data.
 * @param name - Package name
 * @returns Package info
 */
export function getMockPackageInfo(name: string): PackageInfo {
  // Normalize package name (handle scoped packages)
  const normalizedName = name.replace(/^@/, "").replace(/\//g, "-");

  // Check for exact match first
  if (packageInfoFixtures[name]) {
    return packageInfoFixtures[name];
  }

  // Check for normalized match
  if (packageInfoFixtures[normalizedName]) {
    return packageInfoFixtures[normalizedName];
  }

  // Generate mock data for unknown packages
  return generateMockPackageInfo(name);
}
