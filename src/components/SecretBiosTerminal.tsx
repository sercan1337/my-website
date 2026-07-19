"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRetroSoundEnabled,
  requestRetroSound,
  setRetroSoundEnabled,
} from "@/components/RetroSound";

type TerminalLine = {
  id: number;
  text: string;
  kind?: "input" | "error" | "muted";
};

const initialLines: TerminalLine[] = [
  { id: 1, text: "SERCAN_OS secure shell", kind: "muted" },
  { id: 2, text: 'type "help" for available commands', kind: "muted" },
  { id: 3, text: "TAB: autocomplete / UP-DOWN: history / CTRL+L: clear", kind: "muted" },
  { id: 4, text: "terminal mode mounted at /1337", kind: "muted" },
];

const commands = [
  "help",
  "about",
  "blog",
  "contact",
  "clear",
  "quit",
  "whoami",
  "ls",
  "tree",
  "pwd",
  "date",
  "status",
  "version",
  "history",
  "settings",
  "echo <text>",
];

const completionCommands = [
  "help",
  "about",
  "blog",
  "contact",
  "clear",
  "quit",
  "whoami",
  "ls",
  "tree",
  "pwd",
  "date",
  "status",
  "version",
  "history",
  "settings",
  "sound on",
  "sound off",
  "crt low",
  "crt normal",
  "echo ",
  "cat about.txt",
  "cat projects.txt",
  "cat blog.txt",
  "cat contact.txt",
];

function getCommonPrefix(values: string[]) {
  if (values.length === 0) return "";
  return values.reduce((prefix, value) => {
    let index = 0;
    while (index < prefix.length && prefix[index] === value[index]) {
      index++;
    }
    return prefix.slice(0, index);
  });
}

export default function SecretBiosTerminal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [poweringOff, setPoweringOff] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    const savedMode = window.localStorage.getItem("sercan-crt-mode");
    if (savedMode === "low" || savedMode === "normal") {
      document.documentElement.dataset.crt = savedMode;
    }
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  function write(text: string, kind?: TerminalLine["kind"]) {
    setLines((current) => [...current, { id: Date.now() + current.length, text, kind }]);
  }

  function writeBlock(block: string[], kind?: TerminalLine["kind"]) {
    setLines((current) => [
      ...current,
      ...block.map((text, index) => ({
        id: Date.now() + current.length + index,
        text,
        kind,
      })),
    ]);
  }

  function runCommand(rawCommand: string) {
    const normalizedCommand = rawCommand.trim();
    const command = normalizedCommand.toLowerCase();
    if (!command) return;

    setHistory((current) => [command, ...current.filter((item) => item !== command)].slice(0, 30));
    setHistoryIndex(null);
    write(`guest@sercan-os:~$ ${command}`, "input");

    if (command === "clear") {
      setLines([]);
      return;
    }

    if (command === "quit") {
      requestRetroSound("confirm");
      setPoweringOff(true);
      write("SHUTTING DOWN...", "muted");
      setTimeout(() => write("TERMINATING PROCESSES...", "muted"), 250);
      setTimeout(() => write("CLOSING CONNECTIONS...", "muted"), 500);
      setTimeout(() => write("UNMOUNTING FILESYSTEM...", "muted"), 750);
      setTimeout(() => {
        write("");
        write("GOODBYE.", "muted");
        requestRetroSound("confirm");
      }, 1000);
      setTimeout(() => {
        sessionStorage.setItem("sercan-bios-quit", "true");
        router.push("/");
      }, 1800);
      return;
    }

    if (command === "help") {
      writeBlock([
        "available commands:",
        ...commands.map((item) => `  ${item}`),
        "",
        "keys:",
        "  TAB       autocomplete command",
        "  UP/DOWN   command history",
        "  CTRL+L    clear screen",
      ]);
      return;
    }

    if (command === "settings") {
      writeBlock([
        "SYSTEM SETTINGS",
        `sound: ${getRetroSoundEnabled() ? "on" : "off"}`,
        `crt intensity: ${document.documentElement.dataset.crt || "normal"}`,
        `reduced motion: ${
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "on" : "off"
        }`,
        "commands: sound on, sound off, crt low, crt normal",
      ]);
      return;
    }

    if (command === "sound on" || command === "sound off") {
      const enabled = command.endsWith("on");
      setRetroSoundEnabled(enabled);
      write(`sound: ${enabled ? "on" : "off"}`);
      if (enabled) requestRetroSound("confirm");
      return;
    }

    if (command === "crt low" || command === "crt normal") {
      const mode = command.endsWith("low") ? "low" : "normal";
      document.documentElement.dataset.crt = mode;
      window.localStorage.setItem("sercan-crt-mode", mode);
      write(`crt intensity: ${mode}`);
      return;
    }

    if (command === "whoami") {
      write("user: guest");
      write("profile: sercan1337 / student / builder");
      write("mode: hidden BIOS terminal");
      return;
    }

    if (command === "ls") {
      write("about.txt  blog.txt  contact.txt  posts/  system/");
      return;
    }

    if (command === "tree") {
      writeBlock([
        ".",
        "|-- about.txt",
        "|-- blog.txt",
        "|-- contact.txt",
        "|-- projects.txt",
        "|-- posts/",
        "|   |-- minimalism.md",
        "|   |-- coding-and-fun.md",
        "|   `-- fresh-perspective.md",
        "`-- projects/",
        "    |-- novus/",
        "    |-- archive/",
        "    `-- lab/",
      ]);
      return;
    }

    if (command === "pwd") {
      write("/home/guest/sercan-os");
      return;
    }

    if (command === "date") {
      write(new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(new Date()));
      return;
    }

    if (command === "status") {
      writeBlock([
        "system: online",
        "mode: hidden BIOS terminal",
        "network: read-only routes mounted",
        "sound: optional",
      ]);
      return;
    }

    if (command === "version") {
      write("sercan-os bios terminal v1.337");
      return;
    }

    if (command === "history") {
      if (history.length === 0) {
        write("history buffer empty", "muted");
        return;
      }
      writeBlock(history.map((item, index) => `${String(index + 1).padStart(2, "0")}  ${item}`));
      return;
    }

    if (command.startsWith("echo ")) {
      write(normalizedCommand.slice(5));
      return;
    }

    if (command === "cat about.txt") {
      write("I build to understand: code, systems, interfaces, and small personal tools.");
      return;
    }

    if (command === "about") {
      writeBlock([
        "about.txt",
        "I am Sercan, a student and builder learning systems by making them.",
        "stack: Next.js, TypeScript, Tailwind",
        "route reference: /about",
      ]);
      return;
    }

    if (command === "cat projects.txt") {
      writeBlock([
        "projects/",
        "|-- novus/",
        "|   |-- README.md",
        "|   |-- screenshots/",
        "|   |-- tech-stack.json",
        "|   `-- changelog.txt",
        "|-- archive/",
        "|   |-- old-site-redesign.log",
        "|   `-- experiments.txt",
        "`-- lab/",
        "    |-- next-idea.tmp",
        "    `-- concepts/",
        "route reference: /projects",
      ]);
      return;
    }

    if (command === "cat blog.txt" || command === "blog") {
      writeBlock([
        "posts/",
        "-rw-r--r-- is-minimalism-in-websites-really-a-good-thing.md",
        "-rw-r--r-- about-coding-and-having-fun.md",
        "-rw-r--r-- being-able-to-write-code.md",
        "-rw-r--r-- how-does-it-feel-to-have-a-fresh-perspective-after-two-years.md",
        "route reference: /blog",
      ]);
      return;
    }
    
    if (command === "cat contact.txt" || command === "contact") {
      writeBlock([
        "contact-routes",
        "github: https://github.com/sercan1337",
        "x: https://x.com/sercan1337",
        "mail: sercanduran40@hotmail.com",
        "route reference: /about#contact-routes",
      ]);
      return;
    }

    write(`command not found: ${command}`, "error");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    requestRetroSound("confirm");
    runCommand(input);
    setInput("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const query = input.toLowerCase();
      const matches = completionCommands.filter((command) => command.startsWith(query));

      if (matches.length === 0) {
        write(`no completion for: ${input}`, "muted");
        return;
      }

      if (matches.length === 1) {
        setInput(matches[0]);
        return;
      }

      const commonPrefix = getCommonPrefix(matches);
      if (commonPrefix.length > query.length) {
        setInput(commonPrefix);
      }

      writeBlock(matches.map((match) => `  ${match}`), "muted");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(null);
        setInput("");
        return;
      }
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
      return;
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  }

  return (
    <main className={poweringOff ? "secret-bios-screen is-powering-off" : "secret-bios-screen"} onClick={() => inputRef.current?.focus()}>
      <div className="secret-bios-frame">
        <div className="secret-bios-header">
          <span>SERCAN OS BIOS TERMINAL</span>
          <span>ACCESS: GUEST</span>
        </div>
        <div ref={outputRef} className="secret-bios-output" aria-live="polite">
          {lines.map((line) => (
            <p key={line.id} className={line.kind}>
              {line.text}
            </p>
          ))}
        </div>
        <form className="secret-bios-prompt" onSubmit={onSubmit}>
          <label htmlFor="secret-bios-input">guest@sercan-os:~$</label>
          <input
            id="secret-bios-input"
            ref={inputRef}
            data-terminal-sound
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="BIOS terminal command"
          />
        </form>
      </div>
    </main>
  );
}
