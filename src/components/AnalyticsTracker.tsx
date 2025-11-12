"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

interface AnalyticsTrackerProps {
  slug: string;
}

export default function AnalyticsTracker({ slug }: AnalyticsTrackerProps) {
  useAnalytics({
    slug,
    trackView: true,
    trackReadingTime: true,
    minReadingTime: 30,
  });

  return null;
}

