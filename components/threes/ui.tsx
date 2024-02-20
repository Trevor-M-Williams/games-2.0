import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export function GridSpace() {
  return <div className="w-24 h-32 rounded bg-gray-300"></div>;
}

export function Tile({
  value,
  position,
}: {
  value: number;
  position: { x: number; y: number };
}) {
  const dx = 112;
  const dy = 144;

  let bgColor = "bg-white";
  if (value === 1) bgColor = "bg-red-400";
  if (value === 2) bgColor = "bg-blue-400";

  return (
    <div
      className={cn(
        "w-24 h-32 absolute flex items-center justify-center text-6xl rounded transition-transform duration-250 ease-in-out",
        bgColor
      )}
      style={{
        transform: `translate(${position.x * dx + 16}px, ${
          position.y * dy + 16
        }px)`,
      }}
    >
      {value}
    </div>
  );
}

export function NextTile({ value }: { value: number }) {
  let bgColor = "bg-white";
  if (value === 1) bgColor = "bg-red-400";
  if (value === 2) bgColor = "bg-blue-400";

  return (
    <div className="bg-gray-200 p-3 rounded">
      <div
        className={cn(
          "w-[4.5rem] h-[6rem] flex items-center justify-center text-6xl rounded",
          bgColor
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function GameOverModal({
  score,
  highScores,
  newHighScore,
  onRestart,
}: {
  score: number;
  highScores: Score[];
  newHighScore: string;
  onRestart: () => void;
}) {
  return (
    <Modal>
      <div className="flex flex-col items-start">
        <div className="w-full flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold">Game Over</h1>
          <div className="text-3xl">
            <div>Score: {score}</div>
            {newHighScore && (
              <div className="absolute text-blue-500 text-sm">
                New High Score!
              </div>
            )}
          </div>
        </div>
        <div className="text-2xl">High Scores:</div>
        <div className="w-full max-w-[16rem] flex flex-col gap-2 px-2 my-4">
          {highScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((score, i) => (
              <div
                key={score.id}
                className={cn(
                  "flex text-2xl",
                  newHighScore === score.id && "text-blue-500"
                )}
              >
                <div className="w-16">{i + 1}.</div>
                <div>{score.score}</div>
                <div className="flex-grow text-right">{score.name}</div>
              </div>
            ))}
        </div>
        <Button onClick={onRestart}>Restart</Button>
      </div>
    </Modal>
  );
}
