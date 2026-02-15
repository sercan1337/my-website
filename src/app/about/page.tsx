"use client";

import { 
  Terminal, 
  Cpu, 
  Quote,
  Command,
  Hash,
  Type,
  LucideIcon
} from "lucide-react";

export default function AboutPage() {

  const me = {
    education: "high school (9th grade)",
    stack: ["next.js", "typescript", "tailwind"],
    learning: ["backend", "algorithms"],
    contact: ["github", "x", "mail"]
  };

  const links: Record<string, string> = {
    "Github": "https://github.com/sercan1337",
    "X": "https://x.com/sercan1337", 
    "Mail": "mailto:sercanduran40@hotmail.com"
  };

  const devTools = [
    { icon: Terminal, title: "Editor", desc: "Supra (Dark)" },
    { icon: Command, title: "Terminal", desc: "PowerShell / Git Bash" },
    { icon: Type, title: "Font", desc: "Inter" },
    { icon: Hash, title: "Version Control", desc: "Git & GitHub" }
  ];

  return (
    <div className="w-full relative flex flex-col items-center transition-colors duration-500 animate-in fade-in duration-500 slide-in-from-bottom-4">
      
      <div className="relative z-20 max-w-3xl mx-auto py-20 px-6 w-full">
        
        <header className="mb-16 border-b border-gray-600/50 dark:border-gray-800 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white-100 dark:bg-white-500/10 text-white-700 dark:text-gray-400 text-xs font-mono mb-6 border-gray-600 dark:border-gray-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-white"></span>
            </span>
            System Online
          </div>
            
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-mono tracking-tight break-words">
              <span className="text-zinc-900/95 dark:text-zinc-400">~/sercan1337/</span>
              <a
                href="https://github.com/sercan1337/sercan1337"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#42CF8E] dark:text-white font-bold hover:underline hover:underline-offset-4 cursor-pointer transition-all inline-block hover:-translate-y-0.5"
              >
                readme.md
              </a>
          </h1>
           
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          I am a high school student.  I don't just write code; I try to understand how things work behind the scenes. 
          I am currently exploring the depths of the Next.js and Typescript ecosystem.
          </p>
        </header>

        <div className="grid gap-12">
          
          <section>
            <h2 className="text-sm font-mono text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal size={14} />
              Console.log(Me)
            </h2>
            
            <div className="font-mono text-sm bg-gray-50/80 dark:bg-black backdrop-blur-sm border border-gray-200 dark:border-gray-800/60 p-6 rounded-xl shadow-sm relative overflow-hidden group hover:border-[#42CF8E] dark:hover:border-white/80 transition-colors"> 
              <div className="relative z-10 space-y-2">
                <div className="flex gap-2">
                  <span className="text-[#42CF8E] dark:text-gray-300">const</span> 
                  
                  <span className="text-[#374151] dark:text-gray-100">me</span> 
                  
                  <span className="text-[#6B7280] dark:text-gray-500">=</span> 
                  
                  <span className="text-[#6B7280] dark:text-gray-500">{`{`}</span>
                </div>

                {Object.entries(me).map(([key, value],) => (
                  <div key={key} className="pl-6 flex gap-1 flex-wrap">
                    <span className="text-[#374151] dark:text-gray-300">{key}</span>
                    
                    <span className="text-[#6B7280] dark:text-gray-500">:</span>
                    
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[#6B7280] dark:text-gray-500">[</span>
                        
                        {value.map((v, i) => (
                          <span key={i} className="flex">
                            {key === "contact" ? (
                              <a 
                                href={links[v] || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#42CF8E] dark:text-white hover:underline hover:underline-offset-4 cursor-pointer transition-all inline-block hover:-translate-y-0.5"
                              >
                                "{v}"
                              </a>
                            ) : (
                              <span className="text-[#42CF8E] dark:text-gray-400">"{v}"</span>
                            )}
                            
                            {i < value.length - 1 && (
                              <span className="text-[#6B7280] dark:text-gray-500 mr-1">,</span>
                            )}
                          </span>
                        ))}
                        
                        <span className="text-[#6B7280] dark:text-gray-500">]</span>
                      </div>
                    ) : (
                      <span className="text-[#42CF8E] dark:text-gray-400">"{value}"</span>
                    )}
                    
                    <span className="text-[#6B7280] dark:text-gray-500">,</span>
                  </div>
                ))}

                <div className="text-[#6B7280] dark:text-gray-500">{`};`}</div>
                
                <div className="text-[#626262] dark:text-gray-600 pt-2 opacity-70 italic">
                   // TODO: make new project
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-mono text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu size={14} />
              Dev Favorites
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devTools.map((item, index) => (
                <SetupItem 
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                />
              ))}
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <Quote size={20} className="text-gray-400 shrink-0" />
            <p className="text-gray-600 dark:text-gray-500 italic text-sm font-mono">
              "Talk is cheap. Show me the code." <br/>
              <a 
                href="https://github.com/torvalds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs not-italic mt-1 inline-block text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-300 hover:underline underline-offset-2 transition-colors cursor-pointer"
              >
                — Linus Torvalds
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function SetupItem({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/60 dark:bg-black border border-gray-200 dark:border-gray-800/60 hover:border-[#42CF8E] dark:hover:border-white/80 hover:bg-white dark:hover:bg-[#050505] transition-all group backdrop-blur-sm shadow-sm hover:shadow-md">
      <div className="text-gray-400 group-hover:text-[#42CF8E] dark:group-hover:text-white transition-colors">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs font-mono text-gray-500 uppercase mb-0.5">{title}</div>
        <div className="text-gray-800 dark:text-gray-300 text-sm font-medium">{desc}</div>
      </div>
    </div>
  );
}