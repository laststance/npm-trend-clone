import { NextRequest, NextResponse } from "next/server";

/**
 * NPM API download response for a date range.
 */
interface NpmDownloadResponse {
  package: string;
  downloads: Array<{
    downloads: number;
    day: string;
  }>;
}

/**
 * Time range configuration for download queries.
 */
const TIME_RANGES = {
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  "2y": 730,
  "5y": 1825,
} as const;

type TimeRange = keyof typeof TIME_RANGES;

/**
 * Calculates the start date for a given time range.
 * @param range - Time range key (1m, 3m, 6m, 1y, 2y, 5y)
 * @returns ISO date string for the start date
 */
function getStartDate(range: TimeRange): string {
  const days = TIME_RANGES[range];
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
}

/**
 * Fetches download statistics for multiple npm packages.
 * @route GET /api/downloads?packages=react,vue&range=1y
 * @param request - Next.js request object
 * @returns JSON object with download data for each package
 * @example
 * GET /api/downloads?packages=react,vue&range=1y
 * // => { react: { downloads: [...] }, vue: { downloads: [...] } }
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const packagesParam = searchParams.get("packages");
  const range = (searchParams.get("range") || "1y") as TimeRange;

  if (!packagesParam) {
    return NextResponse.json(
      { error: "Packages parameter is required" },
      { status: 400 }
    );
  }

  const packages = packagesParam.split(",").filter(Boolean);

  if (packages.length === 0) {
    return NextResponse.json(
      { error: "At least one package is required" },
      { status: 400 }
    );
  }

  if (packages.length > 10) {
    return NextResponse.json(
      { error: "Maximum 10 packages allowed" },
      { status: 400 }
    );
  }

  if (!(range in TIME_RANGES)) {
    return NextResponse.json(
      { error: `Invalid range. Valid values: ${Object.keys(TIME_RANGES).join(", ")}` },
      { status: 400 }
    );
  }

  const startDate = getStartDate(range);
  const endDate = new Date().toISOString().split("T")[0];

  try {
    // Fetch downloads for all packages in parallel
    const downloadPromises = packages.map(async (pkg) => {
      const response = await fetch(
        `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${encodeURIComponent(pkg)}`,
        {
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return { package: pkg, error: "Package not found", downloads: [] };
        }
        throw new Error(`npm API returned ${response.status} for ${pkg}`);
      }

      const data: NpmDownloadResponse = await response.json();
      return data;
    });

    const results = await Promise.all(downloadPromises);

    // Build response object
    const responseData: Record<
      string,
      { downloads: Array<{ day: string; downloads: number }> } | { error: string }
    > = {};

    for (const result of results) {
      if ("error" in result) {
        responseData[result.package] = { error: result.error };
      } else {
        responseData[result.package] = {
          downloads: result.downloads,
        };
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching download data:", error);
    return NextResponse.json(
      { error: "Failed to fetch download data" },
      { status: 500 }
    );
  }
}
