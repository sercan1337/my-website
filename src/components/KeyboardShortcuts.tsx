"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/components/Toast";

export function KeyboardShortcuts() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Focus search (if search input exists)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="text"][placeholder*="Search"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          showToast("Search focused", "info", 2000);
        }
      }

      // Cmd/Ctrl + D: Toggle dark mode
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        const currentTheme = resolvedTheme || theme;
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        showToast(
          `Switched to ${newTheme} mode`,
          "success",
          2000
        );
      }

      // Escape: Close modals/drawers
      if (e.key === "Escape") {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach((modal) => {
          const closeButton = modal.querySelector(
            'button[aria-label*="Close"], button[aria-label*="close"]'
          ) as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        });
      }

      // Cmd/Ctrl + P: Print
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        // Let browser handle print, but show toast
        setTimeout(() => {
          showToast("Print dialog opened", "info", 2000);
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [theme, resolvedTheme, setTheme, showToast]);

  return null;
}

