"use client";

import { useEffect, useRef } from "react";

interface UseAnalyticsOptions {
  slug: string;
  trackView?: boolean;
  trackReadingTime?: boolean;
  minReadingTime?: number; // Minimum seconds to count as a read
}

export function useAnalytics({
  slug,
  trackView = true,
  trackReadingTime = true,
  minReadingTime = 30,
}: UseAnalyticsOptions) {
  const startTimeRef = useRef<number | null>(null);
  const hasTrackedViewRef = useRef(false);
  const readingTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track view on mount
  useEffect(() => {
    if (!trackView) return;

    const trackViewAsync = async () => {
      try {
        await fetch("/api/analytics/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });
        hasTrackedViewRef.current = true;
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    if (!hasTrackedViewRef.current) {
      trackViewAsync();
    }
  }, [slug, trackView]);

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
    }, 30000); // Check every 30 seconds

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

