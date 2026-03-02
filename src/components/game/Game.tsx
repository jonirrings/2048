"use client";

import { useState, useEffect, useCallback } from "react";
import { Direction } from "@/lib/gameEngine";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useGamepad } from "@/hooks/useGamepad";
import { useTouch } from "@/hooks/useTouch";
import { useOrientation } from "@/hooks/useOrientation";
import { useAnimations } from "@/hooks/useAnimations";
import { GameBoard } from "./GameBoard";
import { Score } from "./Score";
import { GameOver } from "./GameOver";
import { Settings } from "../ui/Settings";

function getBoardSize(): number {
  if (typeof window === "undefined") return 400;

  const maxWidth = Math.min(window.innerWidth - 32, 500);
  const maxHeight = window.innerHeight - 200;
  return Math.min(maxWidth, maxHeight, Math.min(maxHeight, 500));
}

export function Game() {
  const { state, move, restart, continue: continueGame } = useGameLogic();
  const { mode, setMode, availableModes } = useAnimations();
  const [boardSize, setBoardSize] = useState(400);
  const [orientationEnabled, setOrientationEnabled] = useState(false);

  const handleMove = useCallback(
    (direction: Direction) => {
      move(direction);
    },
    [move],
  );

  useKeyboard(handleMove);
  useGamepad(handleMove);
  useTouch(handleMove);

  const {
    supported: orientationSupported,
    enable: enableOrientation,
    disable: disableOrientation,
  } = useOrientation(handleMove);

  useEffect(() => {
    const updateSize = () => setBoardSize(getBoardSize());
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const toggleOrientation = useCallback(() => {
    if (orientationEnabled) {
      disableOrientation();
      setOrientationEnabled(false);
    } else {
      enableOrientation().then(() => setOrientationEnabled(true));
    }
  }, [orientationEnabled, enableOrientation, disableOrientation]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-screen bg-[#faf8ef]">
      <header className="w-full max-w-md flex justify-between items-center">
        <h1 className="text-5xl font-bold text-[#776e65]">2048</h1>
        <Score score={state.score} bestScore={state.bestScore} />
      </header>

      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-[#776e65]">
            Join the numbers to get to <strong>2048!</strong>
          </p>
          <button
            onClick={restart}
            className="bg-[#8f7a66] text-white font-bold py-2 px-4 rounded-md hover:bg-[#7f6a56] transition-colors text-sm"
          >
            New Game
          </button>
        </div>

        <div className="relative">
          <GameBoard tiles={state.tiles} animationMode={mode} size={boardSize} />
          {(state.gameOver || state.won) && (
            <GameOver
              won={state.won}
              score={state.score}
              onRestart={restart}
              onContinue={state.won ? continueGame : undefined}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-md">
        <Settings
          mode={mode}
          onModeChange={setMode}
          availableModes={availableModes}
          orientationEnabled={orientationEnabled}
          onOrientationToggle={toggleOrientation}
          orientationSupported={orientationSupported}
        />
      </div>

      <footer className="text-center text-sm text-[#776e65] mt-4">
        <p>Controls: WASD / Arrow Keys / Gamepad / Swipe / Tilt</p>
      </footer>
    </div>
  );
}
