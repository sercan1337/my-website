"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        <Link href="/" className="font-mono font-bold text-lg tracking-tight hover:opacity-70 transition-opacity">
          ~/sercan
        </Link>

        <div className="flex items-center gap-2">
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
                <span className="relative z-10">{link.label}</span>
                
                <span className="absolute inset-0 z-0 opacity-0 rounded-lg transition-opacity duration-200 group-hover:opacity-100 bg-gray-100 dark:bg-gray-800/80" />
              </Link>
            ))}
          </nav>
          
          <div className="ml-2 pl-4 border-l border-gray-200 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}