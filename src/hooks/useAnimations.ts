"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimationMode } from "@/lib/constants";

const MODE_KEY = "a2048-animation-mode";

function detectWebGPU(): boolean {
  if (typeof window === "undefined") return false;
  return "gpu" in navigator;
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  return !!gl;
}

export function useAnimations() {
  const [mode, setModeState] = useState<AnimationMode>("DOM");
  const [availableModes, setAvailableModes] = useState<AnimationMode[]>(["DOM"]);

  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY) as AnimationMode | null;
    const modes: AnimationMode[] = ["DOM", "SVG"];

    const hasWebGL = detectWebGL();
    const hasWebGPU = detectWebGPU();

    if (hasWebGL) {
      modes.push("WebGL");
    }
    if (hasWebGPU) {
      modes.push("WebGPU");
    }

    setAvailableModes(modes);

    if (saved && modes.includes(saved)) {
      setModeState(saved);
    } else if (hasWebGPU) {
      setModeState("WebGPU");
    } else if (hasWebGL) {
      setModeState("WebGL");
    }
  }, []);

  const setMode = useCallback(
    (newMode: AnimationMode) => {
      if (availableModes.includes(newMode)) {
        setModeState(newMode);
        localStorage.setItem(MODE_KEY, newMode);
      }
    },
    [availableModes],
  );

  return { mode, setMode, availableModes };
}
