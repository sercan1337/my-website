"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const transition = { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      {/* DÜZELTME: 'layout' prop'unu kaldırdık. 
         Yerine 'animate' ile genişliği kontrol ediyoruz. 
         Böylece scroll yaparken saçmalamaz.
      */}
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 76 : 36 }} // Genişliği buradan yönetiyoruz
        transition={transition}
        onClick={() => !isOpen && setIsOpen(true)}
        className={cn(
          "flex items-center overflow-hidden rounded-full border shadow-sm cursor-pointer",
          "border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#09090b]/80 backdrop-blur-md", // Senin sevdiğin renk ayarı
          isOpen ? "px-1" : "px-0"
        )}
        style={{ height: "36px" }} 
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!isOpen ? (
            /* --- KAPALI HAL --- */
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full items-center justify-center absolute inset-0" // absolute ile sabitledik
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </motion.div>
          ) : (
            /* --- AÇIK HAL --- */
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full items-center justify-between gap-1"
            >
              {/* Light Butonu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("light");
                }}
                className="relative flex h-7 w-8 items-center justify-center rounded-full transition-colors z-10"
              >
                {theme === "light" && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-[#42CF8E]"
                    transition={transition}
                  />
                )}
                <Sun className={cn("relative z-10 h-4 w-4 transition-colors", theme === "light" ? "text-white" : "text-gray-500")} />
              </button>

              {/* Dark Butonu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("dark");
                }}
                className="relative flex h-7 w-8 items-center justify-center rounded-full transition-colors z-10"
              >
                {theme === "dark" && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={transition}
                  />
                )}
                <Moon className={cn("relative z-10 h-4 w-4 transition-colors", theme === "dark" ? "text-black" : "text-gray-500")} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}