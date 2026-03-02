"use client";

import { Tile, AnimationMode } from "@/lib/constants";
import { DOMAnimation } from "../animations/DOMAnimation";
import { SVGAnimation } from "../animations/SVGAnimation";
import { WebGLAnimation } from "../animations/WebGLAnimation";
import { WebGPUAnimation } from "../animations/WebGPUAnimation";

interface GameBoardProps {
  tiles: Tile[];
  animationMode: AnimationMode;
  size: number;
}

export function GameBoard({ tiles, animationMode, size }: GameBoardProps) {
  const cellSize = (size - 8 * 5) / 4;

  switch (animationMode) {
    case "SVG":
      return <SVGAnimation tiles={tiles} size={size} />;
    case "WebGL":
      return <WebGLAnimation tiles={tiles} size={size} />;
    case "WebGPU":
      return <WebGPUAnimation tiles={tiles} size={size} />;
    case "DOM":
    default:
      return <DOMAnimation tiles={tiles} cellSize={cellSize} />;
  }
}
