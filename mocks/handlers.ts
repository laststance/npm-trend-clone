import { http, HttpResponse } from "msw";
import {
  getMockSearchResults,
  generateMockDownloadData,
  getWeeklyDownloads,
  reactDownloads30d,
  vueDownloads30d,
} from "./fixtures";

/**
 * MSW request handlers.
 * Shared between browser and server workers.
 *
 * @description
 * Intercepts npm-trend-clone API requests for e2e testing.
 * Uses captured real API data for realistic mocking.
 */
export const handlers = [
  // Health check endpoint
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: "test",
    });
  }),

  /**
   * Internal API: Package search
   * GET /api/packages/search?q=query
   */
  http.get("/api/packages/search", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query || query.length < 2) {
      return HttpResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const results = getMockSearchResults(query);
    return HttpResponse.json(
      results.objects.map((obj) => ({
        name: obj.package.name,
        version: obj.package.version,
        description: obj.package.description,
      }))
    );
  }),

  /**
   * Internal API: Download statistics
   * GET /api/downloads?packages=react,vue&range=1y
   */
  http.get("/api/downloads", ({ request }) => {
    const url = new URL(request.url);
    const packagesParam = url.searchParams.get("packages");
    const range = url.searchParams.get("range") || "1y";

    if (!packagesParam) {
      return HttpResponse.json(
        { error: "Packages parameter is required" },
        { status: 400 }
      );
    }

    const packages = packagesParam.split(",").filter(Boolean);
    if (packages.length === 0) {
      return HttpResponse.json(
        { error: "At least one package is required" },
        { status: 400 }
      );
    }

    if (packages.length > 10) {
      return HttpResponse.json(
        { error: "Maximum 10 packages allowed" },
        { status: 400 }
      );
    }

    const validRanges = ["1m", "3m", "6m", "1y", "2y", "5y"];
    if (!validRanges.includes(range)) {
      return HttpResponse.json(
        { error: `Invalid range. Valid values: ${validRanges.join(", ")}` },
        { status: 400 }
      );
    }

    // Calculate date range
    const rangeDays: Record<string, number> = {
      "1m": 30,
      "3m": 90,
      "6m": 180,
      "1y": 365,
      "2y": 730,
      "5y": 1825,
    };

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays[range]);

    const result: Record<string, { downloads: Array<{ day: string; downloads: number }> } | { error: string }> = {};

    for (const pkg of packages) {
      // Use pre-generated data for known packages, or generate
      if (pkg === "react" && range === "1m") {
        result[pkg] = { downloads: reactDownloads30d.downloads };
      } else if (pkg === "vue" && range === "1m") {
        result[pkg] = { downloads: vueDownloads30d.downloads };
      } else {
        const mockData = generateMockDownloadData(
          pkg,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );
        result[pkg] = { downloads: mockData.downloads };
      }
    }

    return HttpResponse.json(result);
  }),

  /**
   * External API: NPM Registry Search (client-side calls)
   * GET https://registry.npmjs.org/-/v1/search?text=query&size=10
   */
  http.get("https://registry.npmjs.org/-/v1/search", ({ request }) => {
    const url = new URL(request.url);
    const text = url.searchParams.get("text") || "";

    const results = getMockSearchResults(text);

    return HttpResponse.json({
      objects: results.objects.map((obj) => ({
        package: {
          name: obj.package.name,
          version: obj.package.version,
          description: obj.package.description,
        },
        downloads: obj.downloads,
      })),
      total: results.total,
      time: new Date().toISOString(),
    });
  }),

  /**
   * External API: NPM Weekly Downloads (client-side calls)
   * GET https://api.npmjs.org/downloads/point/last-week/:package
   */
  http.get("https://api.npmjs.org/downloads/point/last-week/:package", ({ params }) => {
    const packageName = decodeURIComponent(params.package as string);
    const downloads = getWeeklyDownloads(packageName);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    return HttpResponse.json({
      downloads,
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
      package: packageName,
    });
  }),

  /**
   * External API: NPM Download Range (server-side calls)
   * GET https://api.npmjs.org/downloads/range/:start::end/:package
   */
  http.get("https://api.npmjs.org/downloads/range/:range/:package", ({ params }) => {
    const rangeParam = params.range as string;
    const packageName = decodeURIComponent(params.package as string);

    // Parse range (format: "2025-01-01:2025-12-31")
    const [startDate, endDate] = rangeParam.split(":");

    if (!startDate || !endDate) {
      return HttpResponse.json(
        { error: "Invalid date range format" },
        { status: 400 }
      );
    }

    const mockData = generateMockDownloadData(packageName, startDate, endDate);

    return HttpResponse.json({
      package: packageName,
      start: startDate,
      end: endDate,
      downloads: mockData.downloads,
    });
  }),
];
