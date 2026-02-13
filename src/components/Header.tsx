"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Menu, X as CloseIcon, Terminal } from "lucide-react";
import {
  IconBrandGithub,
  IconBrandX,
  IconMail,
} from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

type Indicator = { width: number; left: number } | null;
type Mode = "underline" | "pill";

export default function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<Indicator>(null);
  const [mode, setMode] = useState<Mode>("underline");

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const measure = (href: string) => {
    const el = itemRefs.current[href];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement!.getBoundingClientRect();

    setIndicator({
      width: rect.width,
      left: rect.left - parentRect.left,
    });
  };

  useLayoutEffect(() => {
    const active =
      links.find(
        (l) =>
          pathname === l.href ||
          (l.href !== "/" && pathname.startsWith(l.href))
      )?.href ?? "/";

    measure(active);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        :root {
          --pill-bg: #ffffff;
          --underline-bg: #000000;
        }
        .dark {
          --pill-bg: #000000;
          --underline-bg: #ffffff;
        }
      `}</style>

      <header className="fixed top-6 inset-x-0 mx-auto z-50 max-w-fit px-2">
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-950/30 backdrop-blur-md shadow-xl shadow-black/5">
          <Link
            href="/"
            className="pl-4 pr-2 font-mono font-bold text-sm tracking-tight text-zinc-900 dark:text-gray-100"
          >
            ~/sercan
          </Link>

          <nav
            className="relative hidden md:flex items-center"
            onMouseLeave={() => setMode("underline")}
          >
            {indicator && (
              <motion.div
                animate={{
                  left: indicator.left,
                  width: indicator.width,
                  height: mode === "pill" ? 20 : 1.5,
                  top: mode === "pill" ? "50%" : "100%",
                  borderRadius: mode === "pill" ? 999 : 1,
                  backgroundColor:
                    mode === "pill"
                      ? "var(--pill-bg)"
                      : "var(--underline-bg)",
                  opacity: mode === "pill" ? 0.75 : 0.95,
                }}
                transition={{
                  type: "tween",
                  ease: "circOut",
                  duration: reduceMotion ? 0.01 : 0.25,
                }}
                className="absolute"
                style={{
                  transform:
                    mode === "pill"
                      ? "translateY(-50%)"
                      : "translateY(0)",
                }}
              />
            )}

            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    itemRefs.current[link.href] = el;
                  }}
                  onMouseEnter={() => {
                    measure(link.href);
                  }}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium z-10 transition-colors",
                    isActive
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 pl-2 pr-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 md:hidden text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col transition-all duration-500 md:hidden",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
          <span className="font-mono text-xs font-bold text-gray-400 flex items-center gap-2">
            <Terminal size={14} /> System Navigation
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-600 dark:text-gray-300"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "font-mono text-5xl font-bold transition-colors",
                pathname === link.href
                ? "text-[#42CF8E] dark:text-white"
                : "text-gray-400 dark:text-gray-600 hover:text-[#42CF8E] dark:hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="pb-12 flex justify-center gap-7">
          <a href="https://github.com/sercan1337">
            <IconBrandGithub size={25} />
          </a>
          <a href="https://x.com/sercan1337">
            <IconBrandX size={25} />
          </a>
          <a href="mailto:sercanduran40@hotmail.com">
            <IconMail size={25} />
          </a>
        </div>
      </div>
    </>
  );
}
