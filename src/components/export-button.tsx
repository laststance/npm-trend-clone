"use client";

import { useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { domToPng } from "modern-screenshot";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExportButtonProps {
  /** CSS selector or ref target for the chart container */
  targetSelector?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Export button that captures the chart as a PNG image.
 * Uses modern-screenshot to render the DOM element to PNG.
 * @param targetSelector - CSS selector for the element to capture (default: '[data-chart-container]')
 * @param disabled - Whether the button is disabled
 * @example
 * <ExportButton /> // Captures element with data-chart-container attribute
 * <ExportButton targetSelector="#my-chart" /> // Captures #my-chart element
 */
export function ExportButton({
  targetSelector = "[data-chart-container]",
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Captures the chart and triggers a PNG download.
   */
  const handleExport = useCallback(async () => {
    const element = document.querySelector(targetSelector);
    if (!element) {
      toast.error("Chart not found");
      return;
    }

    setIsExporting(true);

    try {
      const dataUrl = await domToPng(element as HTMLElement, {
        scale: 2,
        backgroundColor: "#0a0a0a",
      });

      const link = document.createElement("a");
      link.download = `npm-trends-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Chart exported as PNG");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export chart");
    } finally {
      setIsExporting(false);
    }
  }, [targetSelector]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          disabled={disabled || isExporting}
          aria-label="Export chart as PNG"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Export chart as PNG</p>
      </TooltipContent>
    </Tooltip>
  );
}
