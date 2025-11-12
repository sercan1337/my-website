"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = "" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      const scrolled = scrollTop;
      
      const percentage = scrollableHeight > 0 
        ? Math.min(100, (scrolled / scrollableHeight) * 100)
        : 0;
      
      setProgress(percentage);
    };

    // Initial calculation
    updateProgress();

    // Update on scroll
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  if (progress === 0) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

