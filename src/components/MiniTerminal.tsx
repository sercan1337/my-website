"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Volume2, VolumeX, X } from "lucide-react";
import {
  getRetroSoundEnabled,
  requestRetroSound,
  setRetroSoundEnabled,
} from "@/components/RetroSound";
import { cn } from "@/lib/utils";

const commands = [
  "help",
  "about",
  "projects",
  "blog",
  "contact",
  "home",
  "quit",
  "clear",
  "settings",
  "sound on",
  "sound off",
  "crt low",
  "crt normal",
  "open /",
  "open /about",
  "open /projects",
  "open /blog",
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

type Line = {
  id: number;
  text: string;
  kind?: "input" | "system" | "error";
};

export default function MiniTerminal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);
  const [input, setInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([
    { id: 1, text: "SERCAN OS TERMINAL READY", kind: "system" },
    { id: 2, text: "type `help` for commands", kind: "system" },
    { id: 3, text: "TAB: autocomplete / UP-DOWN: history", kind: "system" },
  ]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
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

  function openTerminal() {
    setSoundEnabled(getRetroSoundEnabled());
    setOpen(true);
  }

  function addLine(text: string, kind: Line["kind"] = "system") {
    setLines((current) => [...current, { id: Date.now() + current.length, text, kind }]);
  }

  function addLines(text: string[], kind: Line["kind"] = "system") {
    setLines((current) => [
      ...current,
      ...text.map((line, index) => ({
        id: Date.now() + current.length + index,
        text: line,
        kind,
      })),
    ]);
  }

  function navigate(path: string, message: string) {
    requestRetroSound("confirm");
    addLine(message);
    router.push(path);
  }

  function getReducedMotionLabel() {
    if (typeof window === "undefined") return "unknown";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "on" : "off";
  }

  function setCrtMode(mode: "low" | "normal") {
    document.documentElement.dataset.crt = mode;
    window.localStorage.setItem("sercan-crt-mode", mode);
    addLine(`crt intensity: ${mode}`);
  }

  function runCommand(rawCommand: string) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    setHistory((current) => [command, ...current.filter((item) => item !== command)].slice(0, 24));
    setHistoryIndex(null);
    addLine(`> ${command}`, "input");

    if (command === "clear") {
      setLines([]);
      requestRetroSound("confirm");
      return;
    }

    if (command === "quit") {
      requestRetroSound("confirm");
      setShuttingDown(true);
      addLine("");
      addLine("SHUTTING DOWN...");
      addLine("TERMINATING PROCESSES...");
      setTimeout(() => {
        addLine("CLOSING CONNECTIONS...");
      }, 300);
      setTimeout(() => {
        addLine("UNMOUNTING FILESYSTEM...");
      }, 600);
      setTimeout(() => {
        addLine("");
        addLine("GOODBYE.");
        requestRetroSound("confirm");
      }, 900);
      setTimeout(() => {
        setShuttingDown(false);
        setOpen(false);
      }, 1400);
      return;
    }

    if (command === "help") {
      addLines([
        "available commands:",
        ...commands.map((item) => `  ${item}`),
        "",
        "keys:",
        "  TAB       autocomplete command",
        "  UP/DOWN   command history",
        "",
        "navigation:",
        "  use open /about, open /projects, open /blog",
      ]);
      requestRetroSound("confirm");
      return;
    }

    if (command === "settings") {
      addLines([
        "SYSTEM SETTINGS",
        `sound: ${getRetroSoundEnabled() ? "on" : "off"}`,
        `crt intensity: ${document.documentElement.dataset.crt || "normal"}`,
        `reduced motion: ${getReducedMotionLabel()}`,
        "commands: sound on, sound off, crt low, crt normal",
      ]);
      return;
    }

    if (command === "sound on" || command === "sound off") {
      const enabled = command.endsWith("on");
      setSoundEnabled(enabled);
      setRetroSoundEnabled(enabled);
      addLine(`sound: ${enabled ? "on" : "off"}`);
      if (enabled) requestRetroSound("confirm");
      return;
    }

    if (command === "crt low") {
      setCrtMode("low");
      return;
    }

    if (command === "crt normal") {
      setCrtMode("normal");
      return;
    }

    if (command === "home") {
      addLine("home.exe mounted at /");
      return;
    }

    if (command === "about") {
      addLine("sysinfo mounted at /about");
      return;
    }

    if (command === "projects") {
      addLine("projects.dir mounted at /projects");
      return;
    }

    if (command === "blog") {
      addLine("posts.dir mounted at /blog");
      return;
    }

    if (command === "contact") {
      addLine("contact-routes mounted at /about#contact-routes");
      return;
    }

    if (command === "open /") {
      navigate("/", "opening /");
      return;
    }

    if (command === "open /about") {
      navigate("/about", "opening /about");
      return;
    }

    if (command === "open /projects") {
      navigate("/projects", "opening /projects");
      return;
    }

    if (command === "open /blog") {
      navigate("/blog", "opening /blog");
      return;
    }

    addLine(`command not found: ${command}`, "error");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(input);
    setInput("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const query = input.toLowerCase();
      const matches = commands.filter((command) => command.startsWith(query));

      if (matches.length === 0) {
        addLine(`no completion for: ${input}`, "system");
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
      addLines(matches.map((match) => `  ${match}`));
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
    }
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setRetroSoundEnabled(next);
    if (next) requestRetroSound("confirm");
  }

  return (
    <>
      <button
        type="button"
        className="mini-terminal-launcher"
        aria-label="Open mini terminal"
        aria-expanded={open}
        onClick={openTerminal}
        data-sound-click="nav"
        data-sound-hover="tick"
      >
        <Terminal className="h-5 w-5" />
      </button>

      <section className={cn("mini-terminal-window", open && "is-open", shuttingDown && "is-shutting-down")} aria-label="Mini terminal">
        <div className="system-titlebar">
          <span>TERMINAL.COM</span>
          <span className="mini-terminal-actions">
            <span>{soundEnabled ? "SND ON" : "SND OFF"}</span>
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              data-sound-hover="tick"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close mini terminal"
              data-sound-click="nav"
              data-sound-hover="tick"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        </div>

        <div className="mini-terminal-body" onClick={() => inputRef.current?.focus()}>
          <div ref={outputRef} className="mini-terminal-output" aria-live="polite">
            {lines.map((line) => (
              <p key={line.id} className={line.kind}>
                {line.text}
              </p>
            ))}
          </div>
          <form onSubmit={onSubmit} className="mini-terminal-input">
            <span aria-hidden="true">&gt;</span>
            <input
              ref={inputRef}
              data-terminal-sound
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
          </form>
        </div>
      </section>
    </>
  );
}
