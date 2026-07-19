"use client";

import { useState } from "react";

export default function Spoiler({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 overflow-hidden border border-white/35 bg-[#0500a8]/45 transition-colors">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full cursor-pointer items-center justify-between border-b border-white/20 bg-[#0500a8]/55 p-5 font-medium text-white transition-colors hover:bg-[#0b08d0]/60"
      >
        <span className="text-lg">{title}</span>
        
        <span className={`text-white/70 transition-transform duration-500 group-hover:text-white ${isOpen ? "rotate-180" : ""}`}>
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
          <div className="border-t border-white/20 bg-transparent p-0">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
