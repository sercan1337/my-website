"use client";

import { motion } from "framer-motion";
import { timelineData } from "../data/timeline";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export default function Timeline() {
    const sortedData = timelineData;
  return (
    <div className="max-w-3xl mx-auto px-4 py-1 bg-transparent">
      
      {/* DEĞİŞİKLİK BURADA: space-y-8 yerine space-y-12 yaptık (Boşluk arttı) */}
      <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 space-y-12">
        
        {sortedData.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="relative pl-10 group"
          >
            {/* --- NUMARA --- */}
            <div 
              className="absolute -left-[15px] top-0 flex items-center justify-center w-7 h-7 rounded-full border-2 bg-white dark:bg-black transition-all duration-300 z-10
              border-[#42CF8E] text-[#42CF8E] 
              dark:border-zinc-700 dark:text-zinc-400
              group-hover:bg-[#42CF8E] group-hover:text-white
              dark:group-hover:border-white dark:group-hover:text-white"
            >
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
            
            {/* --- İÇERİK --- */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#42CF8E] dark:group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-0.5 sm:mt-0">
                {item.year}
              </span>
            </div>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-2xl">
              {item.description}
            </p>
            
          </motion.div>
        ))}
      </div>
    </div>
  );
}