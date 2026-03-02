"use client";

interface GameOverProps {
  won: boolean;
  score: number;
  onRestart: () => void;
  onContinue?: () => void;
}

export function GameOver({ won, score, onRestart, onContinue }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-[#faf8ef]/80 flex flex-col items-center justify-center z-10 rounded-lg">
      <h2 className="text-4xl font-bold text-[#776e65] mb-4">{won ? "You Win!" : "Game Over!"}</h2>
      <p className="text-xl text-[#776e65] mb-6">Score: {score}</p>
      <div className="flex gap-4">
        {won && onContinue && (
          <button
            onClick={onContinue}
            className="bg-[#8f7a66] text-white font-bold py-3 px-6 rounded-md hover:bg-[#7f6a56] transition-colors"
          >
            Continue
          </button>
        )}
        <button
          onClick={onRestart}
          className="bg-[#8f7a66] text-white font-bold py-3 px-6 rounded-md hover:bg-[#7f6a56] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
