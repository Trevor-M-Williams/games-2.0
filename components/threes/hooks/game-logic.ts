import { useState, useEffect } from "react";
import { updateTiles, initTiles, mergeTiles } from "../utils";

export function useGameLogic(gridSize: number) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [tileBag, setTileBag] = useState<number[]>([
    1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 6,
  ]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const { newTiles, newTileBag } = initTiles(gridSize, tileBag);
    setTiles(newTiles);
    setTileBag(newTileBag);
  }, [gridSize]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const { moved, newTiles } = updateTiles(event, tiles, gridSize);

      if (isTransitioning) return;

      if (moved) {
        setIsTransitioning(true);
        setTiles(newTiles);
        setTimeout(() => {
          setIsTransitioning(false);
          setTiles(mergeTiles(newTiles));
        }, 120);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tiles, isTransitioning]);

  return { tiles };
}
