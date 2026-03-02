"use client";

import { Tile, GRID_SIZE, TILE_COLORS, TILE_TEXT_COLORS } from "@/lib/constants";

interface SVGAnimationProps {
  tiles: Tile[];
  size: number;
}

const GAP = 8;

export function SVGAnimation({ tiles, size }: SVGAnimationProps) {
  const cellSize = (size - GAP * (GRID_SIZE + 1)) / GRID_SIZE;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {/* Background */}
      <rect x="0" y="0" width={size} height={size} rx="8" fill="#faf8ef" />

      {/* Grid cells */}
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const x = GAP + col * (cellSize + GAP);
        const y = GAP + row * (cellSize + GAP);

        return (
          <rect
            key={`cell-${i}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx="6"
            fill="#bbada0"
          />
        );
      })}

      {/* Tiles */}
      {tiles.map((tile) => {
        const x = GAP + tile.col * (cellSize + GAP);
        const y = GAP + tile.row * (cellSize + GAP);
        const fontSize = tile.value > 100 ? cellSize * 0.35 : cellSize * 0.45;

        return (
          <g key={tile.id} className="tile-group">
            <rect
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx="6"
              className="tile-rect"
              style={{
                fill: TILE_COLORS[tile.value]?.replace("bg-", "") || "#3c3a32",
              }}
            />
            <text
              x={x + cellSize / 2}
              y={y + cellSize / 2 + fontSize / 3}
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight="bold"
              fill={TILE_TEXT_COLORS[tile.value]?.replace("text-", "") || "white"}
            >
              {tile.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
