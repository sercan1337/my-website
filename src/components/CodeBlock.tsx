"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/Toast";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme, resolvedTheme } = useTheme();
  const { showToast } = useToast();
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const highlightCode = async () => {
      setIsLoading(true);
      try {
        // Determine theme - use resolvedTheme if available, fallback to theme
        const currentTheme = resolvedTheme || theme || "dark";
        const shikiTheme = currentTheme === "dark" ? "github-dark" : "github-light";

        const response = await fetch("/api/highlight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language: language || "text",
            theme: shikiTheme,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to highlight code");
        }

        const data = await response.json();
        setHighlightedHtml(data.html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain code
        setHighlightedHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language, theme, resolvedTheme, mounted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast("Code copied to clipboard", "success", 2000);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy code", "error", 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
          Highlighting code...
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-900 dark:border-gray-700">
      {/* Code Block Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <span className="text-xs font-medium text-gray-400">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Highlighted Code */}
      <div
        className="overflow-x-auto [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:text-sm [&_code]:block [&_code]:overflow-x-auto [&_code]:p-4 [&_code]:font-mono [&_code]:leading-relaxed"
        style={{
          // Ensure Shiki styles are applied correctly
          color: isDark ? "#c9d1d9" : "#24292e",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

