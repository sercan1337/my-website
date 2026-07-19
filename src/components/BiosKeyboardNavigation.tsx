"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function getFocusableElements() {
  return Array.from(document.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    if (element.closest("[aria-hidden='true']")) return false;
    if (element.closest(".secret-bios-screen")) return false;
    if (element.getAttribute("aria-disabled") === "true") return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const inViewport =
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth;
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      inViewport &&
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      style.pointerEvents !== "none"
    );
  });
}

export default function BiosKeyboardNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/1337") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isTypingTarget(event.target)) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      event.preventDefault();

      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const activeIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
      const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex =
        activeIndex === -1
          ? 0
          : (activeIndex + direction + focusableElements.length) % focusableElements.length;

      focusableElements[nextIndex]?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname]);

  return null;
}
