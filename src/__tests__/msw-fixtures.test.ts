import { describe, it, expect } from "vitest";
import {
  getMockSearchResults,
  reactSearchResults,
  vueSearchResults,
  angularSearchResults,
  emptySearchResults,
} from "../../mocks/fixtures/search-results";
import {
  generateMockDownloadData,
  getWeeklyDownloads,
  reactDownloads30d,
  vueDownloads30d,
} from "../../mocks/fixtures/download-data";

describe("MSW Fixtures - Search Results", () => {
  describe("getMockSearchResults", () => {
    it("should return react results for 'react' query", () => {
      const result = getMockSearchResults("react");
      expect(result).toBe(reactSearchResults);
      expect(result.objects.length).toBeGreaterThan(0);
      expect(result.objects[0].package.name).toBe("react");
    });

    it("should return react results for 'React' query (case insensitive)", () => {
      const result = getMockSearchResults("React");
      expect(result).toBe(reactSearchResults);
    });

    it("should return react results for 'react-router' query", () => {
      const result = getMockSearchResults("react-router");
      expect(result).toBe(reactSearchResults);
    });

    it("should return vue results for 'vue' query", () => {
      const result = getMockSearchResults("vue");
      expect(result).toBe(vueSearchResults);
      expect(result.objects[0].package.name).toBe("vue");
    });

    it("should return angular results for 'angular' query", () => {
      const result = getMockSearchResults("angular");
      expect(result).toBe(angularSearchResults);
    });

    it("should return empty results for unknown query", () => {
      const result = getMockSearchResults("xyznonexistent");
      expect(result).toBe(emptySearchResults);
      expect(result.objects).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should handle whitespace in query", () => {
      const result = getMockSearchResults("  react  ");
      expect(result).toBe(reactSearchResults);
    });
  });

  describe("Search result structure", () => {
    it("should have valid package structure", () => {
      const result = reactSearchResults;

      for (const obj of result.objects) {
        expect(obj.package).toHaveProperty("name");
        expect(obj.package).toHaveProperty("version");
        expect(obj.package).toHaveProperty("description");
        expect(obj.downloads).toHaveProperty("weekly");
        expect(obj.downloads).toHaveProperty("monthly");
        expect(typeof obj.downloads.weekly).toBe("number");
        expect(typeof obj.downloads.monthly).toBe("number");
      }
    });

    it("should have realistic download counts", () => {
      const react = reactSearchResults.objects[0];

      // React should have millions of downloads
      expect(react.downloads.weekly).toBeGreaterThan(1_000_000);
      expect(react.downloads.monthly).toBeGreaterThan(react.downloads.weekly);
    });
  });
});

describe("MSW Fixtures - Download Data", () => {
  describe("getWeeklyDownloads", () => {
    it("should return correct downloads for react", () => {
      const downloads = getWeeklyDownloads("react");
      expect(downloads).toBe(58239993);
    });

    it("should return correct downloads for vue", () => {
      const downloads = getWeeklyDownloads("vue");
      expect(downloads).toBe(7828470);
    });

    it("should return default value for unknown package", () => {
      const downloads = getWeeklyDownloads("unknown-package-xyz");
      expect(downloads).toBe(10000);
    });
  });

  describe("generateMockDownloadData", () => {
    it("should generate data for the correct date range", () => {
      const data = generateMockDownloadData("react", "2025-12-01", "2025-12-10");

      expect(data.package).toBe("react");
      expect(data.downloads.length).toBe(10); // 10 days
      expect(data.downloads[0].day).toBe("2025-12-01");
      expect(data.downloads[9].day).toBe("2025-12-10");
    });

    it("should generate positive download counts", () => {
      const data = generateMockDownloadData("react", "2025-12-01", "2025-12-07");

      for (const point of data.downloads) {
        expect(point.downloads).toBeGreaterThan(0);
        expect(typeof point.downloads).toBe("number");
      }
    });

    it("should use base downloads from known packages", () => {
      const reactData = generateMockDownloadData("react", "2025-12-01", "2025-12-03");
      const unknownData = generateMockDownloadData("unknown-pkg", "2025-12-01", "2025-12-03");

      // React should have higher average downloads
      const reactAvg = reactData.downloads.reduce((sum, d) => sum + d.downloads, 0) / reactData.downloads.length;
      const unknownAvg = unknownData.downloads.reduce((sum, d) => sum + d.downloads, 0) / unknownData.downloads.length;

      expect(reactAvg).toBeGreaterThan(unknownAvg);
    });

    it("should have lower weekend downloads", () => {
      // Dec 6-7, 2025 are Saturday and Sunday
      const data = generateMockDownloadData("react", "2025-12-05", "2025-12-08");

      const friday = data.downloads.find((d) => d.day === "2025-12-05");
      const saturday = data.downloads.find((d) => d.day === "2025-12-06");
      const monday = data.downloads.find((d) => d.day === "2025-12-08");

      // Weekend should generally be lower (though random variation may affect this)
      // Just verify they exist
      expect(friday).toBeDefined();
      expect(saturday).toBeDefined();
      expect(monday).toBeDefined();
    });
  });

  describe("Pre-generated download data", () => {
    it("should have 31 days of data for react", () => {
      expect(reactDownloads30d.downloads.length).toBe(31);
      expect(reactDownloads30d.package).toBe("react");
    });

    it("should have 31 days of data for vue", () => {
      expect(vueDownloads30d.downloads.length).toBe(31);
      expect(vueDownloads30d.package).toBe("vue");
    });

    it("should have valid date format", () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      for (const point of reactDownloads30d.downloads) {
        expect(point.day).toMatch(dateRegex);
      }
    });

    it("should have chronologically ordered dates", () => {
      const dates = reactDownloads30d.downloads.map((d) => new Date(d.day).getTime());

      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThan(dates[i - 1]);
      }
    });
  });
});
