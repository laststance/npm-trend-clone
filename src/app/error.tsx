"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Error boundary component for route segments.
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Includes expandable error details for debugging.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          An error occurred while rendering this page.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Expandable error details */}
      <div className="w-full max-w-md">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={showDetails}
          aria-controls="error-details"
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
              Show details
            </>
          )}
        </button>
        {showDetails && (
          <div
            id="error-details"
            className="mt-2 rounded-md border bg-muted/50 p-3 text-left"
          >
            <p className="text-xs font-medium text-foreground">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 max-h-48 overflow-auto text-xs text-muted-foreground whitespace-pre-wrap break-all">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={reset}
          className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
