"use client";

import { useOptimistic, useState, useTransition } from "react";
import { incrementClap } from "@/app/actions";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClapButtonProps {
  slug: string;
  initialClaps: number;
}

export default function ClapButton({ slug, initialClaps }: ClapButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticClaps, addOptimisticClap] = useOptimistic(
    initialClaps,
    (state, increment: number) => state + increment
  );
  const [isClicked, setIsClicked] = useState(false);

  const handleClap = async () => {
    startTransition(async () => {
      addOptimisticClap(1);
      setIsClicked(true);
      await incrementClap(slug);
      setTimeout(() => setIsClicked(false), 300); // Animasyon süresi
    });
  };

  return (
    <button
      onClick={handleClap}
      disabled={isPending}
      className={cn(
        // Temel Yapı: Yuvarlak köşeli hap (pill) şekli
        "group flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300",
        "bg-gray-100 dark:bg-gray-900", // Arka plan
        "border border-gray-200 dark:border-gray-800", // Kenarlık
        "hover:border-yellow-500/50 hover:bg-yellow-500/5", // Hover durumu
        "active:scale-95" // Tıklama efekti
      )}
    >
      {/* İkon */}
      <Zap 
        size={16} 
        className={cn(
          "transition-all duration-300 text-gray-400 group-hover:text-yellow-500",
          // Tıklandığında içi dolsun ve parlasın
          isClicked && "fill-yellow-500 text-yellow-500 scale-125 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
        )} 
      />

      {/* Sayı */}
      <span className={cn(
        "font-mono text-sm font-medium text-gray-600 dark:text-gray-400 tabular-nums transition-colors",
        "group-hover:text-gray-900 dark:group-hover:text-gray-100"
      )}>
        {optimisticClaps}
      </span>
    </button>
  );
}