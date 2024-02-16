"use client";
import { GridSpace, Tile } from "@/components/threes/ui";
import { useGameLogic } from "@/components/threes/hooks/game-logic";

export default function Threes() {
  const gridSize = 4;
  const { tiles } = useGameLogic(gridSize);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="relative grid gap-4 p-4 rounded-lg bg-gray-200"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize ** 2 }).map((_, index) => {
          return <GridSpace key={index} />;
        })}
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            value={tile.value}
            position={{ x: tile.x, y: tile.y }}
          />
        ))}
      </div>
    </div>
  );
}
