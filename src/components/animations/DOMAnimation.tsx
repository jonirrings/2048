"use client";

import { Tile, GRID_SIZE } from "@/lib/constants";
import { TILE_COLORS, TILE_TEXT_COLORS } from "@/lib/constants";

interface DOMAnimationProps {
  tiles: Tile[];
  cellSize: number;
}

function getTileStyle(tile: Tile, cellSize: number) {
  const gap = 8;
  const x = tile.col * (cellSize + gap);
  const y = tile.row * (cellSize + gap);

  return {
    transform: `translate(${x}px, ${y}px)`,
    width: cellSize,
    height: cellSize,
  };
}

export function DOMAnimation({ tiles, cellSize }: DOMAnimationProps) {
  return (
    <div className="relative">
      {/* Background grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: 8,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div
            key={i}
            className="bg-[#bbada0] rounded-md"
            style={{ width: cellSize, height: cellSize }}
          />
        ))}
      </div>

      {/* Tiles */}
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className={`absolute left-0 top-0 rounded-md flex items-center justify-center font-bold text-2xl transition-all duration-150 ${
            TILE_COLORS[tile.value] || "bg-[#3c3a32]"
          } ${TILE_TEXT_COLORS[tile.value] || "text-white"}`}
          style={getTileStyle(tile, cellSize)}
        >
          <span
            className="scale-in"
            style={{
              fontSize: tile.value > 100 ? cellSize * 0.35 : cellSize * 0.45,
            }}
          >
            {tile.value}
          </span>
        </div>
      ))}
    </div>
  );
}
