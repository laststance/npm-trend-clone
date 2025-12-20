"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 Not Found page.
 * Displays a user-friendly error message with navigation options.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-14 sm:h-16 items-center px-3 sm:px-4">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold hover:opacity-80 transition-opacity"
          >
            npm trends
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="text-center space-y-6 max-w-md">
          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-8xl sm:text-9xl font-bold text-muted-foreground/30">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Page not found
            </h2>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button asChild size="lg" className="min-h-[44px] w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-h-[44px] w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Try searching for npm packages:
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Link
                href="/?q=react"
                className="text-primary hover:underline underline-offset-4"
              >
                react
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/?q=vue"
                className="text-primary hover:underline underline-offset-4"
              >
                vue
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/?q=angular"
                className="text-primary hover:underline underline-offset-4"
              >
                angular
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            npm trends
          </Link>
          {" — "}
          Compare npm package downloads
        </div>
      </footer>
    </div>
  );
}
