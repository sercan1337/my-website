"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MenuItem = ({ 
    value, 
    icon: Icon, 
    label 
  }: { 
    value: string, 
    icon: any, 
    label: string 
  }) => (
    <button
      onClick={() => {
        setTheme(value);
        setIsOpen(false);
      }}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-sm transition-all duration-200 rounded-md mx-1 my-0.5 w-[calc(100%-8px)]",
        "hover:bg-gray-100 dark:hover:bg-gray-800", // Hover rengi (Gri)
        theme === value 
          ? "text-gray-950 dark:text-white font-medium bg-gray-100 dark:bg-gray-800" 
          : "text-gray-500 dark:text-gray-400"
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      {theme === value && <Check size={14} className="text-gray-950 dark:text-white" />}
    </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            "bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700",
            "text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50",
            isOpen && "ring-2 ring-gray-400/20 bg-gray-200 dark:bg-gray-700"
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/90 dark:bg-gray-950/90 shadow-xl backdrop-blur-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50 py-1">
          <MenuItem value="light" icon={Sun} label="Light" />
          <MenuItem value="dark" icon={Moon} label="Dark" />
          <MenuItem value="system" icon={Monitor} label="System" />
        </div>
      )}
    </div>
  );
}