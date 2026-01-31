"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Menu, X as CloseIcon, Home, BookOpen, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const links = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/blog", label: "Blog", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <User className="w-4 h-4" /> },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 h-16 flex items-center px-4">
         <span className="font-mono font-bold text-lg">~/sercan</span>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8">
        
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="font-mono font-bold text-base sm:text-lg tracking-tight hover:opacity-70 transition-opacity z-50"
        >
          ~/sercan
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                  pathname === link.href
                    ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden z-50">
            <ThemeToggle />
            
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 focus:outline-none"
                aria-label="Toggle Menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-between 
          bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 h-[100dvh]">
          
          <div className="flex justify-end p-6">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-red-500 transition-colors rounded-full"
            >
               <CloseIcon className="w-8 h-8" />
            </button>
          </div>

          <nav className="flex flex-col items-center space-y-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group relative text-4xl font-mono font-bold transition-all duration-300",
                  pathname === link.href 
                    ? "text-green-600 dark:text-green-500" 
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                )}
              >
                <span className={cn(
                    "absolute -left-8 transition-opacity duration-300 text-green-600 dark:text-green-500",
                    pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  &gt;
                </span>
                
                {link.label === 'Home' ? '~/home' : `./${link.label.toLowerCase()}`}
              </Link>
            ))}
          </nav>

          <div className="p-10 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
              root@user:~$ system_shutdown_menu
            </p>
          </div>
          
        </div>
      )}
    </header>
  );
}