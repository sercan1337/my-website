"use client";

import { useEffect, useState } from "react";
import { Eye, Clock, TrendingUp } from "lucide-react";

interface PostStatsProps {
  slug: string;
  className?: string;
}

interface Stats {
  viewCount: number;
  todayViews: number;
  averageReadingTime: number;
  totalReads: number;
}

export default function PostStats({ slug, className = "" }: PostStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `/api/analytics/stats?slug=${encodeURIComponent(slug)}`
        );
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [slug]);

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800 ${className}`}>
        <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    );
  }

  if (!stats || (stats.viewCount === 0 && stats.totalReads === 0)) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800 ${className}`}
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <TrendingUp className="h-4 w-4" />
        Statistics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Views
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {stats.viewCount.toLocaleString()}
            </div>
          </div>
        </div>
        {stats.todayViews > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Today
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.todayViews.toLocaleString()}
              </div>
            </div>
          </div>
        )}
        {stats.averageReadingTime > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Avg. Read Time
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {Math.floor(stats.averageReadingTime / 60)} min
              </div>
            </div>
          </div>
        )}
        {stats.totalReads > 0 && (
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Completed Reads
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.totalReads.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

