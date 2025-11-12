"use client";

import { useEffect, useRef, useState } from "react";

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
  const [viewCount, setViewCount] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasTrackedViewRef = useRef(false);
  const readingTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track view on mount and fetch initial count
  useEffect(() => {
    if (!trackView) return;

    const trackViewAndFetchCount = async () => {
      try {
        // Track view (increment)
        const trackResponse = await fetch("/api/analytics/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });

        if (trackResponse.ok) {
          const trackData = await trackResponse.json();
          setViewCount(trackData.viewCount);
          hasTrackedViewRef.current = true;
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    if (!hasTrackedViewRef.current) {
      trackViewAndFetchCount();
    }
  }, [slug, trackView]);

  // Track reading time
  useEffect(() => {
    if (!trackReadingTime) return;

    startTimeRef.current = Date.now();

    // Track reading time when user leaves the page
    const handleBeforeUnload = () => {
      if (startTimeRef.current) {
        const readingTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );

        if (readingTime >= minReadingTime) {
          // Use sendBeacon for reliable tracking on page unload
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

    // Track reading time periodically (every 30 seconds)
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

      // Final reading time tracking
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

  return {
    viewCount,
  };
}

