"use client";

import Link from "next/link";
import { FileX, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full relative flex items-center justify-center p-4 pb-24 font-mono overflow-hidden">
        
        <main className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#09090b] rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 transition-colors">
          
          <div className="flex items-center justify-between px-3 py-3 md:px-4 bg-gray-50 dark:bg-[#09090b] border-b border-gray-200 dark:border-zinc-800 transition-colors">
             <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex gap-1.5 mr-2 md:mr-4 shrink-0">
                   <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                   <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#09090b] rounded-t-md text-xs md:text-sm border-t-2 transition-colors
                                text-[#D97706] border-[#D97706]
                                dark:text-white dark:border-white font-medium truncate
                ">
                   <FileX size={14} className="shrink-0" />
                   <span className="truncate">404.tsx</span>
                   <span className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer text-xs ml-2">x</span>
                </div>
             </div>
          </div>

          <div className="p-3 md:p-6 overflow-x-auto bg-white dark:bg-[#09090b] transition-colors">
             <div className="flex text-xs md:text-base leading-relaxed w-max md:w-full">
                
                <div className="flex flex-col text-right select-none pr-3 md:pr-4 border-r mr-3 md:mr-4 font-mono transition-colors
                                text-gray-300 border-gray-100
                                dark:text-zinc-800 dark:border-zinc-900
                ">
                   <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                   <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                   <span>11</span><span>12</span><span>13</span><span>14</span>
                </div>

                <div className="font-mono">

                   <div>
                      <span className="text-[#42CF8E] dark:text-white dark:font-bold">import</span>{" "}
                      <span className="text-gray-500 dark:text-zinc-600">{`{ `}</span>
                      <span className="text-[#374151] dark:text-zinc-200">Link</span>
                      <span className="text-gray-500 dark:text-zinc-600">{` }`}</span>{" "}
                      <span className="text-[#42CF8E] dark:text-white dark:font-bold">from</span>{" "}
                      <span className="text-[#42CF8E] dark:text-zinc-400 dark:italic">&quot;next/link&quot;</span>
                      <span className="text-gray-400 dark:text-zinc-600">{`;`}</span>
                   </div>
                   <div className="h-4 md:h-6"></div>
                   
                   <div>
                      <span className="text-[#42CF8E] dark:text-white dark:font-bold">export default function</span>{" "}
                      <span className="text-[#374151] dark:text-white font-bold">NotFound</span>
                      <span className="text-gray-500 dark:text-zinc-600">{`() {`}</span>
                   </div>
                   
                   <div className="pl-4 md:pl-6">
                      <span className="text-[#42CF8E] dark:text-white dark:font-bold">const</span>{" "}
                      <span className="text-[#374151] dark:text-zinc-200">error</span>{" "}
                      <span className="text-gray-500 dark:text-zinc-600">= {"{"}</span>
                   </div>

                   <div className="pl-8 md:pl-12">
                      <span className="text-[#374151] dark:text-zinc-300">code</span>
                      <span className="text-gray-500 dark:text-zinc-600">:</span>{" "}
                      <span className="text-[#D97706] dark:text-white font-bold">404</span>
                      <span className="text-gray-500 dark:text-zinc-600">,</span>
                   </div>

                   <div className="pl-8 md:pl-12">
                      <span className="text-[#374151] dark:text-zinc-300">message</span>
                      <span className="text-gray-500 dark:text-zinc-600">:</span>{" "}
                      <span className="text-[#42CF8E] dark:text-zinc-400 dark:italic">&quot;Page not found.&quot;</span>
                   </div>

                   <div className="pl-4 md:pl-6">
                      <span className="text-gray-500 dark:text-zinc-600">{"};"}</span>
                   </div>
                   
                   <div className="h-4 md:h-6"></div>

                   <div className="pl-4 md:pl-6">
                      <span className="text-[#42CF8E] dark:text-white dark:font-bold">return</span>{" "}
                      <span className="text-gray-500 dark:text-zinc-600">(</span>
                   </div>
                   
                   <div className="pl-8 md:pl-12">
                      <span className="text-gray-400 dark:text-zinc-600 italic">{"// Return to safety"}</span>
                   </div>

                   <div className="pl-8 md:pl-12">
                      <span className="text-gray-500 dark:text-zinc-600">&lt;</span>
                      <span className="text-[#374151] dark:text-zinc-200">Link</span>{" "}
                      <span className="text-[#374151] dark:text-zinc-400">href</span>
                      <span className="text-gray-500 dark:text-zinc-600">=</span>
                      <span className="text-[#42CF8E] dark:text-zinc-400">&quot;/&quot;</span>
                      <span className="text-gray-500 dark:text-zinc-600">&gt;</span>
                   </div>
                   
                   <div className="pl-12 md:pl-16">
                      <Link href="/">
                        <span className="cursor-pointer font-bold border-b border-dashed pb-0.5 transition-all
                                         text-gray-700 border-gray-400 hover:text-[#42CF8E] hover:border-[#42CF8E]
                                         dark:text-white dark:border-white dark:hover:text-zinc-300 dark:hover:border-zinc-300
                        ">
                          Go back home
                        </span>
                      </Link>
                   </div>
                   
                   <div className="pl-8 md:pl-12">
                      <span className="text-gray-500 dark:text-zinc-600">&lt;/</span>
                      <span className="text-[#374151] dark:text-zinc-200">Link</span>
                      <span className="text-gray-500 dark:text-zinc-600">&gt;</span>
                   </div>
                   
                   <div><span className="text-gray-500 dark:text-zinc-600">{"}"}</span></div>
                </div>
             </div>
          </div>

          <div className="border-t p-3 md:p-4 font-mono text-xs md:text-sm transition-colors
                          border-gray-200 bg-gray-50
                          dark:border-zinc-800 dark:bg-[#09090b]
          ">
             <div className="flex items-center gap-2 mb-2 text-[10px] md:text-xs uppercase tracking-wider
                             text-gray-500 dark:text-zinc-500">
                <Terminal size={12} />
                <span>Terminal Output</span>
             </div>
             
             <div className="text-red-600 dark:text-zinc-200 font-medium break-words whitespace-pre-wrap">
                Error: Module not found: Can&apos;t resolve requested URL.
             </div>
             <div className="mt-1 text-gray-600 dark:text-zinc-400 break-words whitespace-pre-wrap">
                at path: <span className="text-gray-400 dark:text-zinc-600">src/app/unknown-route/page.tsx</span>
             </div>
          </div>

        </main>
      </div>
  );
}