"use client";

import { useEffect, useRef } from "react";

interface UseAnalyticsOptions {
  slug: string;
  trackReadingTime?: boolean;
  minReadingTime?: number;
}

export function useAnalytics({
  slug,
  trackReadingTime = true,
  minReadingTime = 30,
}: UseAnalyticsOptions) {
  const startTimeRef = useRef<number | null>(null);
  const readingTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trackReadingTime) return;

    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      if (startTimeRef.current) {
        const readingTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );

        if (readingTime >= minReadingTime) {
          navigator.sendBeacon(
            "/api/analytics/reading-time",
            JSON.stringify({
              slug,
              readingTime,
            })
          );
        }
      }
    };

    readingTimeIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const readingTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );

        if (readingTime >= minReadingTime && readingTime % 30 === 0) {
          fetch("/api/analytics/reading-time", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug,
              readingTime,
            }),
          }).catch((error) => {
            console.error("Error tracking reading time:", error);
          });
        }
      }
    }, 30000);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      if (readingTimeIntervalRef.current) {
        clearInterval(readingTimeIntervalRef.current);
      }

      if (startTimeRef.current) {
        const readingTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );

        if (readingTime >= minReadingTime) {
          navigator.sendBeacon(
            "/api/analytics/reading-time",
            JSON.stringify({
              slug,
              readingTime,
            })
          );
        }
      }
    };
  }, [slug, trackReadingTime, minReadingTime]);

  return {};
}

