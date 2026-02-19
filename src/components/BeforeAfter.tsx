"use client";

import { useState } from "react";
import Image from "next/image";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfter({ beforeImage, afterImage }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden select-none bg-gray-900 border border-gray-800 my-8">
      
      {/* Yeni Tasarım (Arka Plan - Sağda kalacak kısım) */}
      <Image
        src={afterImage}
        alt="Yeni Tasarım"
        fill
        className="object-cover pointer-events-none scale-[1.02]"
        priority
        unoptimized
      />

      {/* Eski Tasarım (Ön Plan - Solda kalacak kısım, sağdan kesiliyor) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt="Eski Tasarım"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Ortadaki Slider Çizgisi ve İkonu */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-[#42CF8E] dark:bg-white pointer-events-none shadow-[0_0_10px_rgba(66,207,142,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#42CF8E] dark:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 5.25 12l3-3m7.5 6l3-3-3-3" />
          </svg>
        </div>
      </div>

      {/* Görünmez Slider Input'u (Kullanıcı Etkileşimi İçin) */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
      />
    </div>
  );
}