import { useState } from "react";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  handleGameOver,
  handleRestart,
}: {
  score: number;
  highScores: Score[];
  newHighScore: string;
  handleGameOver: (name: string) => Promise<void>;
  handleRestart: () => void;
}) {
  const localName = localStorage.getItem("threesName") || "";

  const [name, setName] = useState(localName);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  async function submitScore() {
    if (!name) return;
    let sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "");
    await handleGameOver(sanitizedName);
    setScoreSubmitted(true);
    localStorage.setItem("threesName", sanitizedName);
  }

  return (
    <Modal>
      {!scoreSubmitted ? (
        <>
          <div className="flex flex-col gap-6 items-start">
            <div className="w-full flex items-center gap-6 text-3xl font-medium">
              <h1>Game Over</h1>
              <div className="font-medium">Score: {score}</div>
            </div>
            <Input
              value={name}
              type="text"
              placeholder="Enter your name"
              className="text-xl"
              maxLength={10}
              onChange={(e) => setName(e.target.value)}
            />
            <Button onClick={submitScore}>Submit</Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-6">
            <div className="text-2xl">High Scores:</div>
            {newHighScore && (
              <div className="text-blue-500 text-lg text-nowrap">
                New High Score!
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2 px-4 my-4">
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
                  <div className="w-24">{score.score}</div>
                  <div className="">{score.name}</div>
                </div>
              ))}
          </div>
          <Button onClick={handleRestart}>Restart</Button>
        </>
      )}
    </Modal>
  );
}
