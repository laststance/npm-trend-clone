"use client";

import { useState } from "react";
import { Menu, X, Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Mobile navigation with hamburger menu.
 * Shows a hamburger icon that opens a dropdown menu with navigation items.
 * Only visible on mobile screens (md breakpoint and below).
 *
 * @example
 * <MobileNav />
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        className="min-h-[44px] min-w-[44px]"
        data-testid="mobile-nav-toggle"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            id="mobile-nav-menu"
            className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border bg-popover p-2 shadow-lg"
            role="menu"
            aria-orientation="vertical"
          >
            <a
              href="https://github.com/laststance/npm-trend-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              role="menuitem"
              onClick={closeMenu}
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>

            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                closeMenu();
              }}
              className="flex min-h-[44px] w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              role="menuitem"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
