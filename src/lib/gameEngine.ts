import { GRID_SIZE, WINNING_NUMBER } from "./constants";

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

export type Direction = "up" | "down" | "left" | "right";

let tileIdCounter = 0;

function createTile(row: number, col: number, value?: number): Tile {
  return {
    id: tileIdCounter++,
    value: value ?? (Math.random() < 0.9 ? 2 : 4),
    row,
    col,
    isNew: true,
  };
}

function getEmptyCells(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

function initGame(): Tile[] {
  tileIdCounter = 0;
  const tiles: Tile[] = [];
  const empty1 = getEmptyCells(tiles);
  const pos1 = empty1[Math.floor(Math.random() * empty1.length)];
  tiles.push(createTile(pos1.row, pos1.col));

  const empty2 = getEmptyCells(tiles);
  const pos2 = empty2[Math.floor(Math.random() * empty2.length)];
  tiles.push(createTile(pos2.row, pos2.col));

  return tiles;
}

function moveTiles(
  tiles: Tile[],
  direction: Direction,
): { tiles: Tile[]; score: number; merged: boolean } {
  const newTiles = tiles.map((t) => ({ ...t, isNew: false, isMerged: false }));
  let score = 0;
  let merged = false;

  const getKey = (row: number, col: number) => `${row},${col}`;

  const vectors = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  };

  const vector = vectors[direction];
  const rowRange = vector.row === 1 ? [GRID_SIZE - 1, 0, -1] : [0, GRID_SIZE - 1, 1];
  const colRange = vector.col === 1 ? [GRID_SIZE - 1, 0, -1] : [0, GRID_SIZE - 1, 1];

  const tileMap = new Map<string, Tile>();
  newTiles.forEach((t) => tileMap.set(getKey(t.row, t.col), t));

  const mergedPositions = new Set<string>();

  for (let row = rowRange[0]; row !== rowRange[1] + rowRange[2]; row += rowRange[2]) {
    for (let col = colRange[0]; col !== colRange[1] + colRange[2]; col += colRange[2]) {
      const key = getKey(row, col);
      const tile = tileMap.get(key);
      if (!tile) continue;

      let newRow = row;
      let newCol = col;

      while (true) {
        const nextRow = newRow + vector.row;
        const nextCol = newCol + vector.col;

        if (nextRow < 0 || nextRow >= GRID_SIZE || nextCol < 0 || nextCol >= GRID_SIZE) break;

        const nextKey = getKey(nextRow, nextCol);
        const nextTile = tileMap.get(nextKey);

        if (!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
        } else if (
          nextTile.value === tile.value &&
          !mergedPositions.has(nextKey) &&
          !tile.isMerged
        ) {
          newRow = nextRow;
          newCol = nextCol;
          tile.value *= 2;
          score += tile.value;
          merged = true;
          mergedPositions.add(nextKey);
          tile.isMerged = true;
          tileMap.delete(key);
          tileMap.set(nextKey, tile);
          break;
        } else {
          break;
        }
      }

      if (newRow !== row || newCol !== col) {
        tileMap.delete(key);
        tile.row = newRow;
        tile.col = newCol;
        tileMap.set(getKey(newRow, newCol), tile);
      }
    }
  }

  return { tiles: newTiles, score, merged };
}

function addRandomTile(tiles: Tile[]): Tile[] {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) return tiles;

  const pos = empty[Math.floor(Math.random() * empty.length)];
  const newTile = createTile(pos.row, pos.col);
  return [...tiles, newTile];
}

function checkGameOver(tiles: Tile[]): { gameOver: boolean; won: boolean } {
  if (tiles.some((t) => t.value === WINNING_NUMBER)) {
    return { gameOver: false, won: true };
  }

  if (getEmptyCells(tiles).length > 0) {
    return { gameOver: false, won: false };
  }

  for (const tile of tiles) {
    for (const { row: dRow, col: dCol } of [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ]) {
      const neighbor = tiles.find((t) => t.row === tile.row + dRow && t.col === tile.col + dCol);
      if (neighbor && neighbor.value === tile.value) {
        return { gameOver: false, won: false };
      }
    }
  }

  return { gameOver: true, won: false };
}

export function createInitialState(bestScore: number = 0): GameState {
  const tiles = initGame();
  return {
    tiles,
    score: 0,
    bestScore,
    gameOver: false,
    won: false,
  };
}

export function move(state: GameState, direction: Direction): GameState {
  if (state.gameOver) return state;

  const { tiles, score: moveScore, merged } = moveTiles(state.tiles, direction);

  if (!merged) return state;

  const tilesWithNew = addRandomTile(tiles);
  const { gameOver, won } = checkGameOver(tilesWithNew);

  return {
    tiles: tilesWithNew,
    score: state.score + moveScore,
    bestScore: Math.max(state.bestScore, state.score + moveScore),
    gameOver,
    won: state.won || won,
  };
}

export function restart(bestScore: number): GameState {
  return createInitialState(bestScore);
}
