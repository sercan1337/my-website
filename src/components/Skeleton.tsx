"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseStyles = "animate-pulse rounded bg-gray-200 dark:bg-gray-700";

  const variantStyles = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      {...props}
    />
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <article
          key={i}
          className="border-b border-gray-200 pb-8 dark:border-gray-800"
        >
          <Skeleton className="mb-3 h-8 w-3/4" variant="text" />
          <Skeleton className="mb-4 h-4 w-full" variant="text" />
          <Skeleton className="mb-4 h-4 w-5/6" variant="text" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" variant="text" />
            <Skeleton className="h-4 w-32" variant="text" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function PopularPostsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
        >
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-6 w-6" variant="circular" />
            <Skeleton className="h-4 w-3/4" variant="text" />
          </div>
          <Skeleton className="mb-2 h-3 w-full" variant="text" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-16" variant="text" />
            <Skeleton className="h-3 w-20" variant="text" />
          </div>
        </div>
      ))}
    </div>
  );
}

