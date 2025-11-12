"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

// Helper function to generate matrix column data
function generateMatrixColumns(count: number, widthPercent: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${(i * 100) / widthPercent}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
  }));
}

export default function Leet1337() {
  const [isHoveringHacker, setIsHoveringHacker] = useState(false);
  
  // Generate random values for matrix columns - using useMemo to ensure stability
  const hackerMatrixColumns = useMemo(() => generateMatrixColumns(40, 40), []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center relative overflow-hidden" data-no-pattern>
      {/* Full Screen Matrix Rain Effect - Fades on hover */}
      <div className={`matrix-container transition-opacity duration-1000 ${isHoveringHacker ? "opacity-100" : "opacity-0"}`}>
        {hackerMatrixColumns.map((col) => (
          <div
            key={col.id}
            className="matrix-column"
            style={{
              left: col.left,
              animationDelay: `${col.delay}s`,
              animationDuration: `${col.duration}s`,
            }}
          >
            {Array.from({ length: 25 }).map((_, j) => (
              <div key={j} className="font-mono">
                1337
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Background 1337 Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 flex flex-wrap gap-8 md:gap-16 p-4 md:p-8 opacity-[0.03] dark:opacity-[0.05]">
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="text-3xl md:text-5xl lg:text-6xl font-mono font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap"
              style={{
                transform: `rotate(${-20 + (i % 5) * 8}deg)`,
                marginTop: `${(i % 4) * 2}rem`,
                marginLeft: `${(i % 6) * 1.5}rem`,
              }}
            >
              1337
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Large 1337 Display */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-9xl font-mono">
              1337
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2">
              <svg
                className="h-8 w-8 text-gray-400 dark:text-gray-600 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Elite Message */}
          <div className="relative py-8 px-4 rounded-lg overflow-hidden bg-black/30 dark:bg-black/50">
            <h2 
              className="relative z-10 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl font-mono glow-hover cursor-pointer transition-all duration-300"
              onMouseEnter={() => setIsHoveringHacker(true)}
              onMouseLeave={() => setIsHoveringHacker(false)}
            >
              &lt;3L173 H4X0R D3T3CT3D&lt;/&gt;
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-mono">
            W3LC0M3 T0 TH3 3L173 Z0N3
            <br />
            <span className="text-sm">(I guess you like 1337!)</span>
          </p>

          {/* Navigation Options */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="group button-glow inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-mono border-2 border-transparent hover:border-green-500/50"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              H0M3
            </Link>
            <Link
              href="/blog"
              className="group button-glow inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 font-mono hover:border-green-500/50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              B10G
            </Link>
            <Link
              href="/about"
              className="group button-glow inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 font-mono hover:border-green-500/50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              480UT
            </Link>
          </div>

          {/* Decorative Element */}
          <div className="mt-16 text-gray-300 dark:text-gray-700">
            <svg
              className="mx-auto h-24 w-24 opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

