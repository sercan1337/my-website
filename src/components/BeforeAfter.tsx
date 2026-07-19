"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
}

const clamp = (value: number) => Math.min(96, Math.max(4, value));

export default function BeforeAfter({ beforeImage, afterImage }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const nextPosition = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(clamp(nextPosition));
  }, []);

  return (
    <div className="system-window my-0">
      <div className="system-titlebar">
        <span>COMPARE.EXE</span>
        <span>{Math.round(sliderPosition)}%</span>
      </div>
      <div
        ref={frameRef}
        className="group relative mx-auto aspect-video w-full overflow-hidden border border-white/60 bg-[#05005f] select-none touch-none"
        onPointerDown={(event) => {
          setIsDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          updatePosition(event.clientX);
        }}
        onPointerMove={(event) => {
          if (isDragging) updatePosition(event.clientX);
        }}
        onPointerUp={(event) => {
          setIsDragging(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => setIsDragging(false)}
      >
        <Image
          src={afterImage}
          alt="After design"
          fill
          className="pointer-events-none object-cover"
          priority
          unoptimized
        />

        <div
          className="absolute inset-0 pointer-events-none border-r-2 border-[#d8d8ea]"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt="Before design"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 border border-white/60 bg-[#d8d8ea] px-2 py-1 text-sm font-semibold uppercase text-[#05005f]">
          BEFORE.DAT
        </div>
        <div className="pointer-events-none absolute right-3 top-3 border border-white/60 bg-[#d8d8ea] px-2 py-1 text-sm font-semibold uppercase text-[#05005f]">
          AFTER.DAT
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[#d8d8ea]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-white/70 bg-[#0500a8] text-white shadow-[3px_3px_0_#000] transition-transform duration-200 group-hover:scale-105">
            <ChevronsLeftRight className="h-5 w-5" />
          </div>
        </div>

        <input
          type="range"
          min="4"
          max="96"
          value={sliderPosition}
          aria-label="Compare before and after images"
          onChange={(event) => setSliderPosition(Number(event.target.value))}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <div className="border-t border-white/50 bg-[#d8d8ea] px-3 py-1 text-sm text-[#05005f]">
        drag handle or use range input to compare archived screenshots
      </div>
    </div>
  );
}
