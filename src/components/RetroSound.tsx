"use client";

import { useEffect, useRef } from "react";

const SOUND_KEY = "sercan-retro-sound";
const VOLUME = 0.08;

type SoundName = "tick" | "folder" | "nav" | "confirm" | "key";

function isSoundAllowed() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return false;
  return window.localStorage.getItem(SOUND_KEY) !== "off";
}

export function setRetroSoundEnabled(enabled: boolean) {
  window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
  window.dispatchEvent(new CustomEvent("retro-sound-setting", { detail: { enabled } }));
}

export function getRetroSoundEnabled() {
  if (typeof window === "undefined") return false;
  return isSoundAllowed();
}

export function requestRetroSound(name: SoundName) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("retro-sound", { detail: { name } }));
}

export default function RetroSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastHoverRef = useRef(0);
  const lastKeyRef = useRef(0);
  const activatedRef = useRef(false);

  useEffect(() => {
    function getAudioContext() {
      audioContextRef.current ??= new AudioContext();
      return audioContextRef.current;
    }

    function play(name: SoundName) {
      if (!isSoundAllowed() || !activatedRef.current) return;

      const now = performance.now();
      if (name === "tick" && now - lastHoverRef.current < 160) return;
      if (name === "tick") lastHoverRef.current = now;
      if (name === "key" && now - lastKeyRef.current < 42) return;
      if (name === "key") lastKeyRef.current = now;

      const settings = {
        tick: { frequency: 520, duration: 0.014, wave: "square" as OscillatorType, volume: 0.06 },
        folder: { frequency: 660, duration: 0.042, wave: "sine" as OscillatorType, volume: 0.08 },
        nav: { frequency: 430, duration: 0.026, wave: "triangle" as OscillatorType, volume: 0.07 },
        confirm: { frequency: 760, duration: 0.035, wave: "sine" as OscillatorType, volume: 0.08 },
        key: { frequency: 185, duration: 0.012, wave: "square" as OscillatorType, volume: 0.04 },
      }[name];

      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = settings.wave;
      oscillator.frequency.setValueAtTime(settings.frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.min(settings.volume, VOLUME), context.currentTime + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + settings.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + settings.duration + 0.01);
    }

    function onSound(event: Event) {
      const detail = (event as CustomEvent<{ name?: SoundName }>).detail;
      if (detail?.name) play(detail.name);
    }

    function onPointerOver(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      const soundTarget = target?.closest<HTMLElement>("[data-sound-hover], button, a");
      if (!soundTarget) return;
      play((soundTarget.dataset.soundHover as SoundName | undefined) ?? "tick");
    }

    function onClick(event: MouseEvent) {
      activatedRef.current = true;
      const target = event.target as HTMLElement | null;
      const soundTarget = target?.closest<HTMLElement>("[data-sound-click], button, a");
      if (!soundTarget) return;
      play((soundTarget.dataset.soundClick as SoundName | undefined) ?? "nav");
    }

    function onPointerDown() {
      activatedRef.current = true;
    }

    function onKeyDown(event: KeyboardEvent) {
      activatedRef.current = true;
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable ||
        !!target?.closest("[data-terminal-sound]");
      if (!isTypingTarget) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
        play("key");
      }
      if (event.key === "Enter") {
        play("confirm");
      }
    }

    window.addEventListener("retro-sound", onSound);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("retro-sound", onSound);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
