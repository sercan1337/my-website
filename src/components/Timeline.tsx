"use client";

import { motion } from "framer-motion";
import { timelineData } from "../data/timeline";

type TimelineEntry = (typeof timelineData)[number];

export default function Timeline() {
  const sortedData: TimelineEntry[] = timelineData;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative ml-4 border-l border-[#8b5cf6]/45 pl-8 sm:ml-6 sm:pl-12">
        {sortedData.map((item, index) => (
          <motion.article
            key={`${item.year}-${item.title}`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative pb-12 last:pb-0"
          >
            <div className="absolute -left-[43px] top-0 flex h-9 w-9 items-center justify-center rounded-full border border-[#8b5cf6]/70 bg-black text-sm font-bold text-[#a78bfa] shadow-[0_0_24px_rgba(139,92,246,0.25)] transition-all duration-300 group-hover:border-white group-hover:bg-[#8b5cf6] group-hover:text-white sm:-left-[67px]">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="bsod-panel rounded-2xl border border-white/10 bg-black/35 p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#8b5cf6]/50 group-hover:bg-[#07070d]/85">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white transition-colors group-hover:text-[#a78bfa]">
                  {item.title}
                </h2>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#a855f7]">
                  {item.year}
                </span>
              </div>

              <p className="max-w-3xl text-[15px] leading-7 text-zinc-400">
                {item.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
