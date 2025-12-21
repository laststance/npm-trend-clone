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

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/presets/[id]
 * Get a specific preset by ID.
 *
 * @returns Preset object
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const preset = await prisma.preset.findFirst({
      where: {
        id,
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

    if (!preset) {
      return NextResponse.json(
        { error: "Preset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(preset);
  } catch (error) {
    console.error("Failed to fetch preset:", error);
    return NextResponse.json(
      { error: "Failed to fetch preset" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/presets/[id]
 * Update a preset (rename).
 *
 * @body { name?: string, packages?: string[], timeRange?: string }
 * @returns Updated preset
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, packages, timeRange } = body;

    // Check preset exists and belongs to user
    const existingPreset = await prisma.preset.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingPreset) {
      return NextResponse.json(
        { error: "Preset not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: { name?: string; packages?: string[]; timeRange?: string } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Preset name cannot be empty" },
          { status: 400 }
        );
      }

      if (name.length > MAX_NAME_LENGTH) {
        return NextResponse.json(
          { error: `Preset name must be ${MAX_NAME_LENGTH} characters or less` },
          { status: 400 }
        );
      }

      // Check for duplicate name (excluding current preset)
      const duplicatePreset = await prisma.preset.findFirst({
        where: {
          userId: session.user.id,
          name: { equals: name.trim(), mode: "insensitive" },
          NOT: { id },
        },
      });

      if (duplicatePreset) {
        return NextResponse.json(
          { error: "A preset with this name already exists" },
          { status: 400 }
        );
      }

      updateData.name = name.trim();
    }

    if (packages !== undefined) {
      if (!Array.isArray(packages) || packages.length === 0) {
        return NextResponse.json(
          { error: "At least one package is required" },
          { status: 400 }
        );
      }
      updateData.packages = packages;
    }

    if (timeRange !== undefined) {
      updateData.timeRange = timeRange;
    }

    // Update preset
    const updatedPreset = await prisma.preset.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        packages: true,
        timeRange: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedPreset);
  } catch (error) {
    console.error("Failed to update preset:", error);
    return NextResponse.json(
      { error: "Failed to update preset" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/presets/[id]
 * Delete a preset.
 *
 * @returns Success message
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check preset exists and belongs to user
    const existingPreset = await prisma.preset.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingPreset) {
      return NextResponse.json(
        { error: "Preset not found" },
        { status: 404 }
      );
    }

    // Delete preset
    await prisma.preset.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete preset:", error);
    return NextResponse.json(
      { error: "Failed to delete preset" },
      { status: 500 }
    );
  }
}
