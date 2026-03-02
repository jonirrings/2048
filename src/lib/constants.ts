export const GRID_SIZE = 4;
export const WINNING_NUMBER = 2048;

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export const TILE_COLORS: Record<number, string> = {
  2: "bg-[#eee4da]",
  4: "bg-[#ede0c8]",
  8: "bg-[#f2b179]",
  16: "bg-[#f59563]",
  32: "bg-[#f67c5f]",
  64: "bg-[#f65e3b]",
  128: "bg-[#edcf72]",
  256: "bg-[#edcc61]",
  512: "bg-[#edc850]",
  1024: "bg-[#edc53f]",
  2048: "bg-[#edc22e]",
};

export const TILE_TEXT_COLORS: Record<number, string> = {
  2: "text-[#776e65]",
  4: "text-[#776e65]",
  8: "text-white",
  16: "text-white",
  32: "text-white",
  64: "text-white",
  128: "text-white",
  256: "text-white",
  512: "text-white",
  1024: "text-white",
  2048: "text-white",
};

export const ANIMATION_MODES = ["DOM", "SVG", "WebGL", "WebGPU"] as const;
export type AnimationMode = (typeof ANIMATION_MODES)[number];

export const SWIPE_THRESHOLD = 50;
export const GAMEPAD_POLL_INTERVAL = 100;
export const ORIENTATION_THRESHOLD = 30;

export const VIBRATION_PATTERNS = {
  move: 10,
  merge: 30,
  gameOver: 100,
};

export const RUMBLE_PATTERNS = {
  move: { duration: 10, strongMagnitude: 0.1, weakMagnitude: 0.2 },
  merge: { duration: 30, strongMagnitude: 0.3, weakMagnitude: 0.5 },
  gameOver: { duration: 100, strongMagnitude: 0.8, weakMagnitude: 1.0 },
};
