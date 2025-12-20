/**
 * Mock fixture exports for MSW handlers.
 * Re-exports all fixture data for e2e testing.
 */
export {
  reactSearchResults,
  vueSearchResults,
  angularSearchResults,
  emptySearchResults,
  getMockSearchResults,
  type MockPackage,
  type MockSearchResult,
} from "./search-results";

export {
  generateMockDownloadData,
  reactDownloads30d,
  vueDownloads30d,
  weeklyDownloads,
  getWeeklyDownloads,
  type MockDownloadPoint,
  type MockDownloadResponse,
} from "./download-data";

export {
  packageInfoFixtures,
  generateMockPackageInfo,
  getMockPackageInfo,
} from "./package-info";
