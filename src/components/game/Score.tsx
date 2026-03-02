"use client";

interface ScoreProps {
  score: number;
  bestScore: number;
}

export function Score({ score, bestScore }: ScoreProps) {
  return (
    <div className="flex gap-4">
      <div className="bg-[#bbada0] rounded-md px-4 py-2 text-center min-w-[80px]">
        <div className="text-xs uppercase text-[#eee4da] font-semibold">Score</div>
        <div className="text-xl font-bold text-white">{score}</div>
      </div>
      <div className="bg-[#bbada0] rounded-md px-4 py-2 text-center min-w-[80px]">
        <div className="text-xs uppercase text-[#eee4da] font-semibold">Best</div>
        <div className="text-xl font-bold text-white">{bestScore}</div>
      </div>
    </div>
  );
}
