"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { ChevronDown, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconBrandGithub } from "@tabler/icons-react";

const inter = Inter({ subsets: ["latin"] });

export default function MinimalDesignExample() {
  const [showExample, setShowExample] = useState(false);
  const { resolvedTheme } = useTheme();
  const [exampleTheme, setExampleTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mainTheme = resolvedTheme || "light";
    setExampleTheme(mainTheme as "light" | "dark");
  }, [resolvedTheme]);

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    
    setRipples((prev) => [...prev, newRipple]);
    setIsAnimating(true);

    setExampleTheme(prev => prev === "dark" ? "light" : "dark");

    setTimeout(() => setIsAnimating(false), 500);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <div className="my-8">
      <button
        onClick={() => setShowExample(!showExample)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 shadow-sm hover:shadow-md group active:scale-[0.98]"
      >
        <span className="flex items-center gap-3 text-base font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200">
          {showExample ? (
            <>
              <EyeOff className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
              Hide Example
            </>
          ) : (
            <>
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              View Minimal Design Example
            </>
          )}
        </span>
        <div className={`transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${showExample ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          showExample
            ? 'max-h-[5000px] opacity-100 mt-6'
            : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div 
          className={`${inter.className} rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${exampleTheme === 'dark' ? 'minimal-example-dark' : ''} ${
          showExample 
            ? 'translate-y-0 scale-100 opacity-100 blur-0' 
            : 'translate-y-8 scale-[0.96] opacity-0 blur-sm'
          }`}
        >
          
        <style>{`
          .minimal-wrapper {
            max-width: 100%;
            margin: 0;
            padding: 28px 40px;
            background-color: var(--bg-primary, #fafafa);
            color: var(--text-primary, #1a1a1a);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .minimal-wrapper-dark {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --text-primary: #f5f5f5;
            --text-secondary: #a0a0a0;
            --text-tertiary: #666666;
            --border-color: #2a2a2a;
          }

          /* ... (Previous CSS remains the same) ... */

          .minimal-header {
            margin-bottom: 36px;
            animation: fadeInUp 0.8s ease-out;
            animation-fill-mode: both;
          }

          .minimal-header h1 {
            font-size: clamp(1.5rem, 4vw, 2.25rem);
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
            line-height: 1.2;
          }

          .minimal-header p {
            max-width: 100%;
            color: var(--text-secondary, #666666);
            font-size: 1rem;
            line-height: 1.6;
            font-weight: 400;
          }

          .minimal-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 36px;
            animation: fadeInUp 0.8s ease-out 0.15s both;
          }

          .minimal-card {
            background: var(--bg-secondary, #ffffff);
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--border-color, #e5e5e5);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease;
            position: relative;
            overflow: hidden;
            animation: fadeInUp 0.6s ease-out both;
          }

          .minimal-card:nth-child(1) { animation-delay: 0.25s; }
          .minimal-card:nth-child(2) { animation-delay: 0.35s; }
          .minimal-card:nth-child(3) { animation-delay: 0.45s; }

          .minimal-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
          }

          .minimal-card:hover {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
            border-color: transparent;
          }

          .minimal-card:hover::before {
            transform: scaleX(1);
          }

          .minimal-card h2 {
            font-size: 1.35rem;
            font-weight: 600;
            margin-bottom: 10px;
            letter-spacing: -0.01em;
            color: var(--text-primary, #1a1a1a);
          }

          .minimal-card p {
            color: var(--text-secondary, #666666);
            font-size: 0.95rem;
            line-height: 1.6;
          }

          .minimal-footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color, #e5e5e5);
            font-size: 0.875rem;
            color: var(--text-tertiary, #888888);
            text-align: center;
            animation: fadeInUp 0.8s ease-out 0.5s both;
          }

          .minimal-footer a {
            color: inherit;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.3s ease;
            cursor: pointer;
            display: inline-block;
          }

          .minimal-footer a:hover {
            color: var(--text-primary, #1a1a1a);
            border-bottom-color: var(--text-primary, #1a1a1a);
            transform: translateY(-1px);
          }

          .minimal-footer a:active {
            transform: translateY(0);
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* --- NEW ANIMATIONS FOR BUTTON --- */
          .theme-toggle-ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.8s linear;
            background-color: rgba(150, 150, 150, 0.3);
            pointer-events: none;
            width: 20px;
            height: 20px;
          }

          @keyframes ripple {
            to {
              transform: scale(15);
              opacity: 0;
            }
          }

          .icon-rotate-animation {
            animation: rotate-icon 0.5s ease-in-out;
          }

          @keyframes rotate-icon {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
          }

          @media (max-width: 768px) {
            .minimal-wrapper { padding: 24px 20px; }
            .minimal-header { margin-bottom: 28px; }
            .minimal-section { grid-template-columns: 1fr; gap: 16px; }
            .minimal-card { padding: 20px; }
          }
        `}</style>

        <div className={`minimal-wrapper relative ${exampleTheme === 'dark' ? 'minimal-wrapper-dark' : ''}`}>
          
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleThemeToggle}
              className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border transition-all duration-300 hover:bg-opacity-80 active:scale-95 shadow-sm"
              style={{
                borderColor: exampleTheme === 'dark' ? '#374151' : '#e5e7eb',
                backgroundColor: exampleTheme === 'dark' ? '#1f2937' : '#ffffff',
              }}
              aria-label="Toggle example theme"
            >
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="theme-toggle-ripple"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                  }}
                />
              ))}
              
              <span
                className={`inline-flex items-center justify-center transition-all duration-500 ${
                  isAnimating ? "icon-rotate-animation" : ""
                }`}
                key={exampleTheme} 
              >
                {mounted && exampleTheme === "dark" ? (
                  <Sun className="h-4 w-4" style={{ color: '#d1d5db' }} />
                ) : (
                  <Moon className="h-4 w-4" style={{ color: '#374151' }} />
                )}
              </span>
            </button>
          </div>
        
          <header className="minimal-header">
            <h1>Minimal Website</h1>
            <p>
              A refined layout focused on clarity, thoughtful spacing, and elegant typography. 
              Every element serves a purpose, creating an experience that guides without overwhelming.
            </p>
          </header>

          <section className="minimal-section">
            <div className="minimal-card">
              <h2>Clarity</h2>
              <p>
                Every element has a purpose. No unnecessary visuals or distractions. 
                Clean design that communicates effectively and efficiently.
              </p>
            </div>

            <div className="minimal-card">
              <h2>Balance</h2>
              <p>
                White space, typography, and layout work together harmoniously to guide 
                the user&apos;s attention and create visual rhythm.
              </p>
            </div>

            <div className="minimal-card">
              <h2>Purpose</h2>
              <p>
                Intentional design decisions that enhance usability and create meaningful 
                interactions between content and user.
              </p>
            </div>
          </section>

          <footer className="minimal-footer">
            © 2025 — <a href="https://www.onurhan.dev/" target="_blank" rel="noopener noreferrer">Minimal Design Concept</a>
          </footer>
        </div>

        <a
          href="https://gist.github.com/sercan1337/b0df58f8658820321ef463806a36a6e2"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-4 w-full flex items-center justify-center gap-x-2 px-4 py-3 rounded-lg
            text-sm font-medium
            border border-gray-200 bg-gray-50 text-gray-700
            hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300
            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300
            dark:hover:bg-gray-700 dark:hover:text-white dark:hover:border-gray-600
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          "
        >
          <IconBrandGithub className="w-5 h-5" stroke={1.5} />
          <span>View Code on GitHub Gist</span>
        </a>

        </div>
      </div>
    </div>
  );
}