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
        "w-24 h-32 absolute flex items-center justify-center text-6xl rounded transition-all duration-250 ease-in-out",
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
    <div className="bg-gray-200 p-4 rounded">
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
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) {
  return (
    <Modal>
      <div className="flex flex-col gap-6 items-start">
        <h1 className="text-4xl font-bold">Game Over</h1>
        <div className="text-3xl">Score: {score}</div>
        <Button onClick={onRestart}>Restart</Button>
      </div>
    </Modal>
  );
}
