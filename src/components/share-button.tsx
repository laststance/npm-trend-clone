"use client";

import { useCallback } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareButtonProps {
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Share button that copies the current URL to clipboard.
 * Shows a toast notification on success.
 * @param disabled - Whether the button is disabled
 * @example
 * <ShareButton /> // Copies current URL
 * <ShareButton disabled /> // Disabled state
 */
export function ShareButton({ disabled = false }: ShareButtonProps) {
  /**
   * Copies the current URL to clipboard and shows a toast.
   */
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard", {
        icon: <Check className="h-4 w-4" />,
        duration: 2000,
      });
    } catch {
      toast.error("Failed to copy URL");
    }
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          disabled={disabled}
          aria-label="Share URL"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy URL to clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
}
