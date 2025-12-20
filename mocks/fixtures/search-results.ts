/**
 * Mock search results for e2e testing.
 * Captured from real npm registry API.
 */

export interface MockPackage {
  name: string;
  version: string;
  description: string;
}

export interface MockSearchResult {
  objects: Array<{
    package: MockPackage;
    downloads: {
      weekly: number;
      monthly: number;
    };
  }>;
  total: number;
}

/**
 * Search results for "react" query.
 */
export const reactSearchResults: MockSearchResult = {
  objects: [
    {
      package: {
        name: "react",
        version: "19.2.3",
        description: "React is a JavaScript library for building user interfaces.",
      },
      downloads: {
        weekly: 59216660,
        monthly: 252441870,
      },
    },
    {
      package: {
        name: "react-dom",
        version: "19.2.3",
        description: "React package for working with the DOM.",
      },
      downloads: {
        weekly: 51853152,
        monthly: 229767842,
      },
    },
    {
      package: {
        name: "react-router",
        version: "7.11.0",
        description: "Declarative routing for React",
      },
      downloads: {
        weekly: 20281242,
        monthly: 90440061,
      },
    },
    {
      package: {
        name: "react-redux",
        version: "9.2.0",
        description: "Official React bindings for Redux",
      },
      downloads: {
        weekly: 13141398,
        monthly: 58571337,
      },
    },
    {
      package: {
        name: "react-is",
        version: "19.2.3",
        description: "Brand checking of React Elements.",
      },
      downloads: {
        weekly: 167058436,
        monthly: 742794966,
      },
    },
  ],
  total: 448864,
};

/**
 * Search results for "vue" query.
 */
export const vueSearchResults: MockSearchResult = {
  objects: [
    {
      package: {
        name: "vue",
        version: "3.5.14",
        description: "The progressive JavaScript framework for building modern web UI.",
      },
      downloads: {
        weekly: 7828470,
        monthly: 32145000,
      },
    },
    {
      package: {
        name: "vue-router",
        version: "4.5.0",
        description: "Official router for Vue.js",
      },
      downloads: {
        weekly: 3521000,
        monthly: 14250000,
      },
    },
    {
      package: {
        name: "vue-demi",
        version: "0.14.10",
        description: "Create universal Vue libraries for Vue 2 & 3",
      },
      downloads: {
        weekly: 8200000,
        monthly: 35100000,
      },
    },
  ],
  total: 89234,
};

/**
 * Search results for "angular" query.
 */
export const angularSearchResults: MockSearchResult = {
  objects: [
    {
      package: {
        name: "@angular/core",
        version: "19.2.0",
        description: "Angular - the core framework",
      },
      downloads: {
        weekly: 4280000,
        monthly: 17500000,
      },
    },
    {
      package: {
        name: "@angular/common",
        version: "19.2.0",
        description: "Angular - commonly needed directives and services",
      },
      downloads: {
        weekly: 4150000,
        monthly: 17000000,
      },
    },
  ],
  total: 45678,
};

/**
 * Generic empty results for unknown queries.
 */
export const emptySearchResults: MockSearchResult = {
  objects: [],
  total: 0,
};

/**
 * Get mock search results by query.
 * @param query - Search query string.
 * @returns Mock search result or empty result.
 * @example
 * getMockSearchResults("react") // => reactSearchResults
 * getMockSearchResults("unknown") // => emptySearchResults
 */
export function getMockSearchResults(query: string): MockSearchResult {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.startsWith("react")) {
    return reactSearchResults;
  }
  if (normalizedQuery.startsWith("vue")) {
    return vueSearchResults;
  }
  if (normalizedQuery.startsWith("angular")) {
    return angularSearchResults;
  }

  return emptySearchResults;
}
