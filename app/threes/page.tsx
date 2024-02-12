"use client";
import { useEffect, useState } from "react";
import { GridSpace, Tile } from "@/components/threes/ui";

export default function Threes() {
  const gridSize = 4;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return;

      let newX = position.x;
      let newY = position.y;
      switch (event.key) {
        case "ArrowUp":
          newY = Math.max(0, position.y - 1);
          break;
        case "ArrowDown":
          newY = Math.min(gridSize - 1, position.y + 1);
          break;
        case "ArrowLeft":
          newX = Math.max(0, position.x - 1);
          break;
        case "ArrowRight":
          newX = Math.min(gridSize - 1, position.x + 1);
          break;
        default:
          return;
      }

      setIsTransitioning(true);
      setPosition({ x: newX, y: newY });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position, isTransitioning]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="relative grid gap-4 p-4 rounded-lg bg-gray-200"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize ** 2 }).map((_, index) => {
          return <GridSpace key={index} />;
        })}
        <Tile value={1} position={{ x: position.x, y: position.y }} />
      </div>
    </div>
  );
}
