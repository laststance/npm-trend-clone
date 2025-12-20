import { NextRequest, NextResponse } from "next/server";

/**
 * NPM package search result from registry API.
 */
interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      version: string;
      description?: string;
    };
  }>;
}

/**
 * Search npm packages by query string.
 * @route GET /api/packages/search?q=query
 * @param request - Next.js request object
 * @returns JSON array of matching packages
 * @example
 * GET /api/packages/search?q=react
 * // => [{ name: "react", version: "18.2.0", description: "..." }, ...]
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`npm registry returned ${response.status}`);
    }

    const data: NpmSearchResult = await response.json();

    const packages = data.objects.map((obj) => ({
      name: obj.package.name,
      version: obj.package.version,
      description: obj.package.description || "",
    }));

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error searching npm packages:", error);
    return NextResponse.json(
      { error: "Failed to search packages" },
      { status: 500 }
    );
  }
}
