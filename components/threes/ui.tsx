import { useState, useEffect, useRef } from "react";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function GridSpace() {
  return <div className="h-32 w-24 rounded bg-gray-300"></div>;
}

export function Tile({
  value,
  position,
  transition,
}: {
  value: number;
  position: { x: number; y: number };
  transition?: "left" | "right" | "up" | "down";
}) {
  const tileRef = useRef<HTMLDivElement>(null);

  const dx = 112;
  const dy = 144;

  const xPos = position.x * dx + 16;
  const yPos = position.y * dy + 16;

  let bgColor = "bg-white";
  if (value === 1) bgColor = "bg-red-400";
  if (value === 2) bgColor = "bg-blue-400";

  useEffect(() => {
    if (!transition || !tileRef.current) return;

    let xTransform = 0;
    let yTransform = 0;

    if (transition === "left") xTransform = 2 * dx;
    else if (transition === "right") xTransform = -2 * dx;
    else if (transition === "up") yTransform = 2 * dy;
    else if (transition === "down") yTransform = -2 * dy;

    tileRef.current.style.top = `${yTransform}px`;
    tileRef.current.style.left = `${xTransform}px`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!tileRef.current) return;
        tileRef.current.style.top = `0px`;
        tileRef.current.style.left = `0px`;
      });
    });
  }, [value, position, transition]);

  return (
    <div
      ref={tileRef}
      className={cn(
        " absolute flex h-32 w-24 items-center justify-center rounded border text-6xl transition-all duration-200",
        bgColor,
      )}
      style={{
        transform: `translate(${xPos}px, ${yPos}px)`,
      }}
    >
      {value}
    </div>
  );
}

export function NextTile({ value }: { value: number | null }) {
  let bgColor = "bg-white";
  if (value === 1) bgColor = "bg-red-400";
  if (value === 2) bgColor = "bg-blue-400";
  if (!value) bgColor = "bg-gray-200";

  return (
    <div className="rounded bg-gray-200 p-3">
      <div
        className={cn(
          "flex h-[6rem] w-[4.5rem] items-center justify-center rounded text-6xl",
          bgColor,
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
          <div className="flex flex-col items-start gap-6">
            <div className="flex w-full items-center justify-between gap-6 text-xl font-medium sm:text-3xl">
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
            <div className="text-xl sm:text-2xl">High Scores:</div>
            {newHighScore && (
              <div className="text-nowrap text-lg text-blue-500">
                New High Score!
              </div>
            )}
          </div>
          <div className="my-4 flex w-full flex-col gap-2 px-4">
            {highScores
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((score, i) => (
                <div
                  key={score.id}
                  className={cn(
                    "flex text-xl sm:text-2xl",
                    newHighScore === score.id && "text-blue-500",
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
