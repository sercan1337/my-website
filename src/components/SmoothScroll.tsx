"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isCoarsePointer) return;

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId: number | null = null;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const getDelta = (event: WheelEvent) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 18;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
      return event.deltaY;
    };

    const animate = () => {
      const distance = targetY - currentY;
      currentY += distance * 0.12;

      if (Math.abs(distance) < 0.35) {
        currentY = targetY;
        window.scrollTo(0, targetY);
        rafId = null;
        return;
      }

      window.scrollTo(0, currentY);
      rafId = window.requestAnimationFrame(animate);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.defaultPrevented) return;

      event.preventDefault();
      currentY = window.scrollY;
      targetY = clamp(targetY + getDelta(event) * 0.82, 0, getMaxScroll());

      if (!rafId) rafId = window.requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (!rafId) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
