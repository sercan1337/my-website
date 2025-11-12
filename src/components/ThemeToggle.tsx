"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isClickTriggered = useRef(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger animations when theme changes externally (e.g., keyboard shortcut)
  const triggerAnimations = useCallback((x?: number, y?: number) => {
    setIsAnimating(true);
    
    // Create ripple effect - use provided coordinates or center of button
    let rippleX = x;
    let rippleY = y;
    
    if (rippleX === undefined || rippleY === undefined) {
      // Use center of button if coordinates not provided (keyboard shortcut)
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        rippleX = rect.width / 2;
        rippleY = rect.height / 2;
      } else {
        rippleX = 18; // Fallback to approximate center (button is 36px = h-9 w-9)
        rippleY = 18;
      }
    }
    
    const newRipple = {
      id: Date.now(),
      x: rippleX,
      y: rippleY,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, []);

  const prevThemeRef = useRef<string>("light");

  // Force update when resolvedTheme changes - this ensures React re-renders
  useEffect(() => {
    const newTheme = resolvedTheme || theme || "light";
    if (newTheme !== prevThemeRef.current) {
      prevThemeRef.current = newTheme;
      
      // Update state asynchronously to avoid synchronous setState in effect
      setTimeout(() => {
        setCurrentTheme(newTheme);
        
        // If theme changed but wasn't triggered by click, trigger animations
        if (!isClickTriggered.current && mounted) {
          triggerAnimations();
        }
        
        // Reset the flag after a short delay to allow state updates
        setTimeout(() => {
          isClickTriggered.current = false;
        }, 100);
      }, 0);
    }
  }, [resolvedTheme, theme, mounted, triggerAnimations]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    isClickTriggered.current = true;
    
    // Create ripple effect at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    triggerAnimations(x, y);
    
    // Toggle theme
    const actualTheme = resolvedTheme || theme || "light";
    setTheme(actualTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white transition-all duration-500 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 text-gray-700 transition-all duration-500 dark:text-gray-300" />
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white transition-all duration-500 hover:bg-gray-100 active:scale-95 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="theme-toggle-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
          }}
        />
      ))}
      
      {/* Icon with rotation animation */}
      <span
        className={`inline-flex items-center justify-center transition-all duration-500 ${
          isAnimating ? "icon-rotate-animation" : ""
        }`}
        key={currentTheme} // Force re-render when theme changes
      >
        {currentTheme === "dark" ? (
          <Sun className="h-4 w-4 text-gray-700 transition-all duration-500 dark:text-gray-300" />
        ) : (
          <Moon className="h-4 w-4 text-gray-700 transition-all duration-500 dark:text-gray-300" />
        )}
      </span>
    </button>
  );
}
