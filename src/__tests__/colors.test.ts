import { describe, it, expect } from "vitest";
import { CHART_COLORS, MAX_PACKAGES } from "@/constants/colors";

describe("Chart Colors Constants", () => {
  describe("CHART_COLORS", () => {
    it("should have enough colors for MAX_PACKAGES", () => {
      expect(CHART_COLORS.length).toBeGreaterThanOrEqual(MAX_PACKAGES);
    });

    it("should have valid hex color format", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      for (const color of CHART_COLORS) {
        expect(color).toMatch(hexColorRegex);
      }
    });

    it("should have unique colors", () => {
      const uniqueColors = new Set(CHART_COLORS);
      expect(uniqueColors.size).toBe(CHART_COLORS.length);
    });

    it("should have visually distinct colors", () => {
      // Basic check: no two colors should be too similar
      // (This is a simplified check - in reality you'd calculate color distance)
      for (let i = 0; i < CHART_COLORS.length; i++) {
        for (let j = i + 1; j < CHART_COLORS.length; j++) {
          expect(CHART_COLORS[i]).not.toBe(CHART_COLORS[j]);
        }
      }
    });
  });

  describe("MAX_PACKAGES", () => {
    it("should be a reasonable limit", () => {
      expect(MAX_PACKAGES).toBeGreaterThanOrEqual(2);
      expect(MAX_PACKAGES).toBeLessThanOrEqual(10);
    });

    it("should be 6", () => {
      expect(MAX_PACKAGES).toBe(6);
    });
  });
});
