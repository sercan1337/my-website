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
      education: "High School (9th Grade)",
      location: "Turkey",
      stack: ["Next.js", "TypeScript", "Tailwind"],
      learning: ["Backend", "Algorithms"],
    };

    const devTools = [
      { icon: Terminal, title: "Editor", desc: "Supra (Dark)" },
      { icon: Command, title: "Terminal", desc: "PowerShell / Git Bash" },
      { icon: Type, title: "Font", desc: "Inter" },
      { icon: Hash, title: "Version Control", desc: "Git & GitHub" }
    ];

    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes grid-move {
            0% { background-position: 0 0; }
            100% { background-position: 30px 30px; }
          }
          .animate-grid {
            animation: grid-move 3s linear infinite;
          }
        `}} />

        <div className="min-h-screen w-full relative flex flex-col items-center bg-white dark:bg-gray-950 transition-colors duration-500">
          
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <div className="absolute h-full w-full -top-10 -left-10 
              bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] 
              dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] 
              animate-grid"
              style={{ backgroundSize: '30px 30px' }}>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_10%,black)] dark:bg-gray-950 pointer-events-none transition-colors duration-500"></div>

          <div className="relative z-20 max-w-3xl mx-auto py-20 px-6 w-full">
            
          <header className="mb-16 border-b border-gray-200 dark:border-gray-800/60 pb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white-100 dark:bg-white-500/10 text-white-700 dark:text-green-400 text-xs font-mono mb-6 border border-white-200 dark:border-white-500/20">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 dark:bg-white-500"></span>
            </span>
            System Online
          </div>
              
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-mono tracking-tight break-words">
             <span className="text-white-400 dark:text-white-400">~/sercan/</span>
             <span className="text-green-500 dark:text-green-500">readme.md</span>
        </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                High school student from Turkey. I don't just write code; I try to understand how things work under the hood. 
                Currently exploring the depths of Next.js and React ecosystem.
              </p>
            </header>

            <div className="grid gap-12">
              
              <section>
                <h2 className="text-sm font-mono text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Terminal size={14} />
                  Console.log(Me)
                </h2>
                
                <div className="font-mono text-sm bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-6 rounded-xl text-gray-800 dark:text-gray-300 shadow-sm relative overflow-hidden group hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-[0.03] pointer-events-none">
                    <Hash size={100} />
                  </div>

                  <div className="relative z-10 space-y-2">
                    <div className="flex gap-2">
                      <span className="text-purple-600 dark:text-purple-400">const</span> 
                      <span className="text-yellow-600 dark:text-yellow-200">me</span> 
                      <span className="text-gray-400">=</span> 
                      <span className="text-gray-400">{`{`}</span>
                    </div>

                    {Object.entries(me).map(([key, value], index) => (
                      <div key={key} className="pl-6 flex gap-1 flex-wrap">
                        <span className="text-blue-600 dark:text-blue-300">{key}</span>
                        <span className="text-gray-400">:</span>
                        
                        {Array.isArray(value) ? (
                          <span className="text-orange-600 dark:text-orange-300 break-all">
                            [{value.map(v => `"${v}"`).join(", ")}]
                          </span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">"{value}"</span>
                        )}
                        
                        <span className="text-gray-400">,</span>
                      </div>
                    ))}

                    <div className="text-gray-400">{`};`}</div>
                    <div className="text-gray-400 dark:text-gray-600 pt-2 opacity-70 italic">// TODO: Build something awesome</div>
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
                  <span className="text-xs not-italic mt-1 block text-gray-400 dark:text-gray-600">— Linus Torvalds</span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  }

  function SetupItem({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/60 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 hover:border-green-500/30 hover:bg-white dark:hover:bg-gray-800/80 transition-all group backdrop-blur-sm shadow-sm hover:shadow-md">
        <div className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase mb-0.5">{title}</div>
          <div className="text-gray-800 dark:text-gray-300 text-sm font-medium">{desc}</div>
        </div>
      </div>
    );
  }