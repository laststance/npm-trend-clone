"use client";

import { ExternalLink, Github, Star, Download, Calendar, Scale, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PackageInfo } from "@/types/package";

/**
 * Props for PackageInfoCard component.
 */
interface PackageInfoCardProps {
  /** Package information to display */
  packageInfo: PackageInfo;
  /** Accent color matching the chart line (hex format) */
  accentColor: string;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

/**
 * Formats a number with K/M/B suffix for readability.
 * @param num - Number to format
 * @returns Formatted string with suffix
 * @example
 * formatNumber(1234) // => "1.2K"
 * formatNumber(1234567) // => "1.2M"
 */
function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Formats a date string to a human-readable relative format.
 * @param dateString - ISO date string
 * @returns Human-readable date (e.g., "2 days ago", "3 months ago")
 */
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Displays package information in a card format.
 * Shows name, description, version, downloads, stars, license, and links.
 */
export function PackageInfoCard({
  packageInfo,
  accentColor,
  onRemove,
}: PackageInfoCardProps) {
  const {
    name,
    description,
    version,
    license,
    repositoryUrl,
    lastPublished,
    weeklyDownloads,
    githubStars,
  } = packageInfo;

  const npmUrl = `https://www.npmjs.com/package/${encodeURIComponent(name)}`;

  return (
    <Card className="relative overflow-hidden">
      {/* Accent color bar */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: accentColor }}
      />

      <CardHeader className="pl-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="font-mono text-base">{name}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {description}
            </CardDescription>
          </div>
          <CardAction>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label={`Remove ${name} from comparison`}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="pl-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {/* Version */}
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-xs">
              v{version}
            </Badge>
          </div>

          {/* Weekly Downloads */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span className="font-tabular-nums">{formatNumber(weeklyDownloads)}</span>
            <span className="text-xs">/week</span>
          </div>

          {/* GitHub Stars */}
          {githubStars !== undefined && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span className="font-tabular-nums">{formatNumber(githubStars)}</span>
            </div>
          )}

          {/* License */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span>{license}</span>
          </div>
        </div>

        {/* Last Published */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Updated {formatRelativeDate(lastPublished)}</span>
        </div>

        {/* Links */}
        <div className="mt-4 flex items-center gap-3">
          <a
            href={npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            npm
          </a>
          {repositoryUrl && (
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for PackageInfoCard.
 */
export function PackageInfoCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1 bg-muted" />

      <CardHeader className="pl-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>

      <CardContent className="pl-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="mt-3 h-3 w-24" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Error state for PackageInfoCard.
 */
interface PackageInfoCardErrorProps {
  /** Package name that failed to load */
  packageName: string;
  /** Accent color matching the chart line */
  accentColor: string;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

export function PackageInfoCardError({
  packageName,
  accentColor,
  onRemove,
}: PackageInfoCardErrorProps) {
  return (
    <Card className="relative overflow-hidden border-destructive/50">
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: accentColor }}
      />

      <CardHeader className="pl-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="font-mono text-base text-destructive">
              {packageName}
            </CardTitle>
            <CardDescription className="text-destructive/80">
              Failed to load package information
            </CardDescription>
          </div>
          <CardAction>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label={`Remove ${packageName} from comparison`}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  );
}
