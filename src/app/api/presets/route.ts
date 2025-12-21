import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { headers } from "next/headers";

/**
 * Prisma client instance for database operations.
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Maximum number of presets per user.
 */
const MAX_PRESETS = 10;

/**
 * Maximum length for preset names.
 */
const MAX_NAME_LENGTH = 50;

/**
 * Get current session from request.
 */
async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * GET /api/presets
 * List all presets for the authenticated user.
 *
 * @returns Array of presets sorted by creation date (newest first)
 *
 * @example
 * // Response:
 * [
 *   { "id": "...", "name": "Frontend Frameworks", "packages": ["react", "vue"], ... }
 * ]
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const presets = await prisma.preset.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        packages: true,
        timeRange: true,
        createdAt: true,
      },
    });

    return NextResponse.json(presets);
  } catch (error) {
    console.error("Failed to fetch presets:", error);
    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/presets
 * Create a new preset for the authenticated user.
 *
 * @body { name: string, packages: string[], timeRange?: string }
 * @returns Created preset
 *
 * @example
 * // Request body:
 * { "name": "Frontend Frameworks", "packages": ["react", "vue", "angular"] }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, packages, timeRange = "1y" } = body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Preset name is required" },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Preset name must be ${MAX_NAME_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    // Validate packages
    if (!Array.isArray(packages) || packages.length === 0) {
      return NextResponse.json(
        { error: "At least one package is required" },
        { status: 400 }
      );
    }

    // Check preset limit
    const existingCount = await prisma.preset.count({
      where: { userId: session.user.id },
    });

    if (existingCount >= MAX_PRESETS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_PRESETS} presets allowed` },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existingPreset = await prisma.preset.findFirst({
      where: {
        userId: session.user.id,
        name: { equals: name.trim(), mode: "insensitive" },
      },
    });

    if (existingPreset) {
      return NextResponse.json(
        { error: "A preset with this name already exists" },
        { status: 400 }
      );
    }

    // Create preset
    const preset = await prisma.preset.create({
      data: {
        name: name.trim(),
        packages,
        timeRange,
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        packages: true,
        timeRange: true,
        createdAt: true,
      },
    });

    return NextResponse.json(preset, { status: 201 });
  } catch (error) {
    console.error("Failed to create preset:", error);
    return NextResponse.json(
      { error: "Failed to create preset" },
      { status: 500 }
    );
  }
}
