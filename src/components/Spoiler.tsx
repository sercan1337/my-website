"use client";

import { useState } from "react";

export default function Spoiler({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl mb-6 overflow-hidden bg-white dark:bg-black/20 transition-colors">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-full flex justify-between items-center font-medium cursor-pointer p-5 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="text-lg">{title}</span>
        
        <span className={`transition-transform duration-500 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 ${isOpen ? "rotate-180" : ""}`}>
          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </button>
      
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0a]">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}