import Link from "next/link";
import { timelineData } from "@/data/timeline";

const systemInfo = [
  ["USER", "sercan1337"],
  ["ROLE", "high school student / builder"],
  ["STACK", "next.js, typescript, tailwind"],
  ["LEARNING", "backend, algorithms, systems"],
  ["EDITOR", "Supra (Dark)"],
  ["FONT", "VT323 / Lucida Console"],
];

const contactRoutes = [
  ["github", "https://github.com/sercan1337"],
  ["x", "https://x.com/_sercan1337"],
  ["mail", "mailto:sercanduran40@hotmail.com"],
];

export const metadata = {
  title: "About | Sercan Duran",
  description: "System information.",
};

export default function AboutPage() {
  return (
    <div className="grid gap-6 pb-20">
      <section className="system-window">
        <div className="system-titlebar">
          <span>SYSINFO.EXE</span>
          <span>PROFILE LOADED</span>
        </div>
        <div className="system-content">
          <h1 className="text-3xl font-bold sm:text-5xl">System information</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            I build to understand. This page is the machine-readable version of
            me: learning, shipping, breaking, and rebuilding.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <div className="system-window">
          <div className="system-titlebar">
            <span>CONFIG.SYS</span>
            <span>READ ONLY</span>
          </div>
          <div>
            {systemInfo.map(([key, value]) => (
              <div key={key} className="file-row">
                <span>{key}</span>
                <span className="lg:col-span-2">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="system-window">
        <div id="contact-routes" className="system-titlebar">
          <span>CONTACT ROUTES</span>
          <span>OPEN</span>
        </div>
          <div className="system-content grid gap-3">
            {contactRoutes.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                target={label === "mail" ? undefined : "_blank"}
                rel={label === "mail" ? undefined : "noopener noreferrer"}
                className="retro-command p-3"
              >
                {`> open ${label}`}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="system-window">
        <div className="system-titlebar">
          <span>BOOTLOG.TXT</span>
          <span>{timelineData.length} EVENTS</span>
        </div>
        <div className="system-content">
          <ol className="system-history-log">
            {timelineData.map((item, index) => (
              <li key={`${item.year}-${item.title}`} className="system-history-row">
                <span className="system-history-branch" aria-hidden="true">
                  {index === timelineData.length - 1 ? "└─" : "├─"}
                </span>
                <time className="system-history-date">{item.year}</time>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
