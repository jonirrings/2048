"use client";

import { useEffect, useCallback } from "react";
import { Direction } from "@/lib/gameEngine";

type KeyHandler = (direction: Direction) => void;

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  a: "left",
  A: "left",
  s: "down",
  S: "down",
  d: "right",
  D: "right",
  k: "up",
  K: "up",
  j: "down",
  J: "down",
  h: "left",
  H: "left",
  l: "right",
  L: "right",
};

export function useKeyboard(onMove: KeyHandler) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const direction = KEY_MAP[e.key];
      if (direction) {
        e.preventDefault();
        onMove(direction);
      }
    },
    [onMove],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
