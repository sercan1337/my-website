"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const bootLines = [
  "SERCAN BIOS v1.337",
  "checking memory ................ OK",
  "mounting /portfolio ............ OK",
  "scanning archive sectors ....... OK",
  "loading interface ..............",
];

export default function PageLoadOverlay() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [isVisible, setIsVisible] = useState(true);
  const [bootPath, setBootPath] = useState(pathname);
  const [bootMode, setBootMode] = useState<"boot" | "open">("boot");

  if (pathname !== prevPathname.current) {
    prevPathname.current = pathname;
    setIsVisible(true);
    setBootPath(pathname);
    setBootMode("boot");
  }

  useEffect(() => {
    const isFromBios = sessionStorage.getItem("sercan-bios-quit") === "true";
    if (isFromBios) {
      sessionStorage.removeItem("sercan-bios-quit");
    }

    const timeout = window.setTimeout(() => {
      setIsVisible(false);
    }, isFromBios ? 3500 : 680);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      setBootPath(url.pathname);
      setBootMode("open");
      setIsVisible(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      className={`boot-overlay fixed inset-0 z-[120] ${
        isVisible ? "is-active" : "is-hidden"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="boot-window">
        <div className="boot-titlebar">
          <span>{bootMode === "open" ? "OPENING FILE..." : "BOOT SEQUENCE"}</span>
          <span>{bootPath}</span>
        </div>

        <div className="boot-body">
          {bootLines.map((line) => (
            <p key={line}>{`> ${line}`}</p>
          ))}
          <p>{"> BOOT OK"}</p>
          <p className="boot-caret">{`> target: ${bootPath}`}</p>
        </div>
      </div>

      <div className="boot-urlbar">https://sercan.local{bootPath}</div>
    </div>
  );
}
