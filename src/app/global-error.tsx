"use client";

import { useEffect } from "react";

/**
 * Global error boundary for root layout errors.
 * This component handles errors that occur in the root layout.
 * Must include its own html and body tags as it replaces the root layout.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              A critical error occurred. Please try again.
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Intentional: Use <a> for full page reload when root layout has failed, as Router context may be unavailable */}
            <a
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
