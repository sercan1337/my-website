"use client";

import { useState, useEffect } from "react";
import { BookOpen, X, Type, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadingModeProps {
  children: React.ReactNode;
}

export default function ReadingMode({ children }: ReadingModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [maxWidth, setMaxWidth] = useState(65); // rem

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem("readingMode-fontSize");
    const savedLineHeight = localStorage.getItem("readingMode-lineHeight");
    const savedMaxWidth = localStorage.getItem("readingMode-maxWidth");

    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    if (savedMaxWidth) setMaxWidth(Number(savedMaxWidth));
  }, []);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    localStorage.setItem("readingMode-fontSize", String(newSize));
  };

  const handleLineHeightChange = (delta: number) => {
    const newHeight = Math.max(1.2, Math.min(2.5, lineHeight + delta * 0.1));
    setLineHeight(newHeight);
    localStorage.setItem("readingMode-lineHeight", String(newHeight));
  };

  const handleMaxWidthChange = (delta: number) => {
    const newWidth = Math.max(45, Math.min(85, maxWidth + delta));
    setMaxWidth(newWidth);
    localStorage.setItem("readingMode-maxWidth", String(newWidth));
  };

  const resetSettings = () => {
    setFontSize(16);
    setLineHeight(1.7);
    setMaxWidth(65);
    localStorage.removeItem("readingMode-fontSize");
    localStorage.removeItem("readingMode-lineHeight");
    localStorage.removeItem("readingMode-maxWidth");
  };

  if (!isOpen) {
    return (
      <>
        {children}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all duration-300 hover:bg-gray-800 hover:scale-110 active:scale-95 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          aria-label="Open reading mode"
        >
          <BookOpen className="h-5 w-5" />
        </button>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
        }}
      >
        <div
          className="mx-auto h-full overflow-y-auto px-4 py-8"
          style={{ maxWidth: `${maxWidth}rem` }}
        >
          {children}
        </div>
      </div>

      {/* Reading Mode Controls */}
      <div className="fixed right-6 top-1/2 z-50 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Reading Mode
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            aria-label="Close reading mode"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Font Size: {fontSize}px
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFontSizeChange(-1)}
                className="rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                aria-label="Decrease font size"
              >
                <Minus className="h-3 w-3" />
              </button>
              <div className="flex-1 rounded bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-2 rounded bg-blue-600 transition-all"
                  style={{ width: `${((fontSize - 12) / 12) * 100}%` }}
                />
              </div>
              <button
                onClick={() => handleFontSizeChange(1)}
                className="rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                aria-label="Increase font size"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Line Height: {lineHeight.toFixed(1)}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLineHeightChange(-1)}
                className="rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                aria-label="Decrease line height"
              >
                <Minus className="h-3 w-3" />
              </button>
              <div className="flex-1 rounded bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-2 rounded bg-blue-600 transition-all"
                  style={{ width: `${((lineHeight - 1.2) / 1.3) * 100}%` }}
                />
              </div>
              <button
                onClick={() => handleLineHeightChange(1)}
                className="rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                aria-label="Increase line height"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Max Width */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Max Width: {maxWidth}rem
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMaxWidthChange(-5)}
                className="rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                aria-label="Decrease max width"
              >
                <Minus className="h-3 w-3" />
              </button>
              <div className="flex-1 rounded bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-2 rounded bg-blue-600 transition-all"
                  style={{ width: `${((maxWidth - 45) / 40) * 100}%` }}
                />
              </div>
              <button
                onClick={() => handleMaxWidthChange(5)}
                className="rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                aria-label="Increase max width"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSettings}
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </>
  );
}

