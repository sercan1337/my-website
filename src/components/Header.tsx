"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", command: "home.exe" },
  { href: "/blog", label: "Blog", command: "posts.dir" },
  { href: "/projects", label: "Projects", command: "projects.dir" },
  { href: "/about", label: "About", command: "sysinfo" },
];

const asciiBrand = String.raw`  ___
 / __| ___ _ _ __ __ _ _ _
 \__ \/ -_) '_/ _/ _' | ' \
 |___/\___|_| \__\__,_|_||_|`;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const displayPath = pathname === "/" ? "/bios/portfolio" : `/bios/portfolio${pathname}`;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (pathname === "/1337") {
    return null;
  }

  return (
    <>
      <header className="archive-shell fixed inset-x-0 top-0 z-50">
        <div className="retro-browser-bar">
          <div className="retro-brand">
            <span>INTERNET ARCHIVE</span>
            <pre aria-label="Sercan ASCII logo">{asciiBrand}</pre>
          </div>

          <div className="retro-url" aria-label="Current system address">
            <span>https://sercan.local</span>
            <span>{displayPath}</span>
          </div>

          <nav className="retro-nav hidden md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("retro-nav-button", active && "is-active")}
                  aria-current={active ? "page" : undefined}
                  data-sound-click="nav"
                  data-sound-hover="tick"
                >
                  <span>{active ? `> ${item.label}` : item.label}</span>
                  <small>{item.command}</small>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="retro-menu-button retro-menu-trigger"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            data-sound-click="nav"
            data-sound-hover="tick"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className={cn("retro-mobile-menu md:hidden", open && "is-open")}>
        <div className="flex items-center justify-between border-b border-white/40 p-4">
          <span className="text-xs uppercase">SYSTEM NAVIGATION</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="retro-menu-button"
            aria-label="Close navigation"
            data-sound-click="nav"
            data-sound-hover="tick"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "retro-mobile-link",
                (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) &&
                  "is-active"
              )}
              aria-current={
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "page"
                  : undefined
              }
              data-sound-click="nav"
              data-sound-hover="tick"
            >
              <span>{item.label}</span>
              <small>{item.command}</small>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
