"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, Direction, createInitialState, move, restart } from "@/lib/gameEngine";
import { useHaptics } from "./useHaptics";

const GAME_STATE_KEY = "a2048-game-state";
const BEST_SCORE_KEY = "a2048-best-score";

function loadGameState(): GameState {
  if (typeof window === "undefined") {
    return createInitialState(0);
  }

  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as GameState;
      // Validate the saved state has required fields
      if (
        parsed.tiles &&
        Array.isArray(parsed.tiles) &&
        typeof parsed.score === "number" &&
        typeof parsed.bestScore === "number" &&
        typeof parsed.gameOver === "boolean" &&
        typeof parsed.won === "boolean"
      ) {
        return parsed;
      }
    }
  } catch {
    // Invalid save data, start fresh
  }

  const best = parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0", 10);
  return createInitialState(best);
}

function saveGameState(state: GameState) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    localStorage.setItem(BEST_SCORE_KEY, state.bestScore.toString());
  } catch {
    // Storage full or unavailable
  }
}

export function useGameLogic() {
  const [state, setState] = useState<GameState>(loadGameState);

  const { triggerFeedback } = useHaptics();

  // Save state on every change
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const handleMove = useCallback(
    (direction: Direction) => {
      setState((prev) => {
        if (prev.gameOver) return prev;

        const newState = move(prev, direction);

        if (newState !== prev) {
          if (newState.gameOver) {
            triggerFeedback("gameOver");
          } else if (newState.won) {
            triggerFeedback("merge");
          } else {
            triggerFeedback("move");
          }
        }

        return newState;
      });
    },
    [triggerFeedback],
  );

  const handleRestart = useCallback(() => {
    setState((prev) => restart(prev.bestScore));
  }, []);

  const handleContinue = useCallback(() => {
    setState((prev) => ({ ...prev, won: false }));
  }, []);

  return {
    state,
    move: handleMove,
    restart: handleRestart,
    continue: handleContinue,
  };
}
