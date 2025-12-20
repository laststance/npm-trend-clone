import { NextRequest, NextResponse } from "next/server";
import type { PackageInfo } from "@/types/package";

/**
 * npm registry package metadata response structure.
 */
interface NpmRegistryPackage {
  name: string;
  description?: string;
  "dist-tags": { latest: string };
  license?: string | { type: string };
  homepage?: string;
  repository?: { type: string; url: string } | string;
  time: Record<string, string>;
}

/**
 * npm downloads API response structure.
 */
interface NpmDownloadsResponse {
  downloads: number;
  package: string;
  start: string;
  end: string;
}

/**
 * GitHub repository API response structure.
 */
interface GitHubRepoResponse {
  stargazers_count: number;
}

/**
 * Extracts GitHub repository URL from npm package repository field.
 * @param repository - npm repository field
 * @returns Normalized GitHub URL or undefined
 */
function extractGitHubUrl(
  repository?: { type: string; url: string } | string
): string | undefined {
  if (!repository) return undefined;

  let url: string;
  if (typeof repository === "string") {
    url = repository;
  } else {
    url = repository.url || "";
  }

  // Handle various GitHub URL formats
  // git+https://github.com/user/repo.git
  // git://github.com/user/repo.git
  // https://github.com/user/repo
  // github:user/repo

  if (url.includes("github.com")) {
    return url
      .replace(/^git\+/, "")
      .replace(/^git:\/\//, "https://")
      .replace(/\.git$/, "")
      .replace(/^ssh:\/\/git@github\.com/, "https://github.com");
  }

  if (url.startsWith("github:")) {
    return `https://github.com/${url.replace("github:", "")}`;
  }

  return undefined;
}

/**
 * Extracts license string from npm package license field.
 * @param license - npm license field
 * @returns License string or "Unknown"
 */
function extractLicense(license?: string | { type: string }): string {
  if (!license) return "Unknown";
  if (typeof license === "string") return license;
  return license.type || "Unknown";
}

/**
 * Fetches GitHub stars for a repository.
 * @param repoUrl - GitHub repository URL
 * @returns Star count or undefined if failed
 */
async function fetchGitHubStars(repoUrl: string): Promise<number | undefined> {
  try {
    // Extract owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return undefined;

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "npm-trend-clone",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return undefined;

    const data: GitHubRepoResponse = await response.json();
    return data.stargazers_count;
  } catch {
    return undefined;
  }
}

/**
 * Get package information from npm registry.
 * @route GET /api/packages/info?packages=react,vue
 * @param request - Next.js request object
 * @returns JSON object with package information
 * @example
 * GET /api/packages/info?packages=react,vue
 * // => { react: { name: "react", ... }, vue: { name: "vue", ... } }
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const packagesParam = searchParams.get("packages");

  if (!packagesParam) {
    return NextResponse.json(
      { error: "packages parameter is required" },
      { status: 400 }
    );
  }

  const packageNames = packagesParam.split(",").filter(Boolean);

  if (packageNames.length === 0) {
    return NextResponse.json(
      { error: "At least one package name is required" },
      { status: 400 }
    );
  }

  const results: Record<string, PackageInfo | { error: string }> = {};

  await Promise.all(
    packageNames.map(async (name) => {
      try {
        // Fetch package metadata from npm registry
        const [registryResponse, downloadsResponse] = await Promise.all([
          fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 3600 }, // Cache for 1 hour
          }),
          fetch(
            `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`,
            {
              headers: { Accept: "application/json" },
              next: { revalidate: 3600 },
            }
          ),
        ]);

        if (!registryResponse.ok) {
          results[name] = { error: "Package not found" };
          return;
        }

        const registryData: NpmRegistryPackage = await registryResponse.json();
        const latestVersion = registryData["dist-tags"].latest;
        const repositoryUrl = extractGitHubUrl(registryData.repository);

        // Fetch GitHub stars if repository URL is available
        const githubStars = repositoryUrl
          ? await fetchGitHubStars(repositoryUrl)
          : undefined;

        // Get weekly downloads
        let weeklyDownloads = 0;
        if (downloadsResponse.ok) {
          const downloadsData: NpmDownloadsResponse =
            await downloadsResponse.json();
          weeklyDownloads = downloadsData.downloads;
        }

        // Get last publish date for latest version
        const lastPublished =
          registryData.time[latestVersion] || registryData.time.modified;

        const packageInfo: PackageInfo = {
          name: registryData.name,
          description: registryData.description || "No description available",
          version: latestVersion,
          license: extractLicense(registryData.license),
          homepage: registryData.homepage,
          repositoryUrl,
          lastPublished,
          weeklyDownloads,
          githubStars,
        };

        results[name] = packageInfo;
      } catch (error) {
        console.error(`Error fetching package ${name}:`, error);
        results[name] = { error: "Failed to fetch package info" };
      }
    })
  );

  return NextResponse.json(results);
}
