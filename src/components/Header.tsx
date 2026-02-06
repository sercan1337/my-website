"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Menu, X as CloseIcon, Terminal } from "lucide-react";
import { IconBrandGithub, IconBrandX, IconMail } from "@tabler/icons-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
 useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  if (!mounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        .animate-grid {
          animation: grid-move 3s linear infinite;
        }
      `}} />

      <header className="fixed top-6 inset-x-0 mx-auto z-50 max-w-fit px-2">
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md shadow-xl shadow-black/5">
          
          <Link 
            href="/" 
            className="pl-4 pr-2 font-mono font-bold text-sm tracking-tight text-zinc-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            ~/sercan
          </Link>

          <nav className="hidden md:flex items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full",
                  pathname === link.href
                    ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 pl-2 pr-2">
            <ThemeToggle />
            
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2 md:hidden text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all"
            >
                <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col transition-all duration-500 ease-in-out md:hidden",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-gray-950 dark:via-transparent dark:to-gray-950" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
            <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={14} /> System Navigation
            </span>
            <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
            >
                <CloseIcon size={24} strokeWidth={1.5} />
            </button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-10">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                        "group font-mono text-5xl font-bold tracking-tight transition-all duration-300 flex items-center",
                        pathname === link.href
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white"
                    )}
                >
                    <span className={cn(
                        "text-2xl mr-4 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0",
                        pathname === link.href ? "opacity-100 translate-x-0 text-white-500" : "text-gray-400"
                    )}>
                        {">"}
                    </span>
                    {link.label}
                </Link>
            ))}
        </div>

        <div className="relative z-10 pb-12 flex flex-col items-center gap-6">
            <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
            <div className="flex items-center gap-8">
                <a href="https://github.com/sercan1337" target="_blank" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-110 duration-200">
                    <IconBrandGithub size={28} stroke={1.5} />
                </a>
                <a href="https://x.com/sercan1337" target="_blank" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-110 duration-200">
                    <IconBrandX size={28} stroke={1.5} />
                </a>
                <a href="mailto:sercanduran40@hotmail.com" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-110 duration-200">
                    <IconMail size={28} stroke={1.5} />
                </a>
            </div>
        </div>

      </div>
    </>
  );
}