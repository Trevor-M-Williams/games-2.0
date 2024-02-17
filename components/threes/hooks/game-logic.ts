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
      if (isTransitioning) return;

      const validKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
      ];

      if (!validKeys.includes(event.key)) return;

      const { moved, newTiles, newTile } = updateTiles(event, tiles, gridSize);

      if (moved) {
        setIsTransitioning(true);
        setTiles(newTiles);

        setTimeout(() => {
          if (newTile) setTiles(updateNewTile(newTiles, newTile));
        }, 10);

        setTimeout(() => {
          setIsTransitioning(false);
          setTiles(mergeTiles(newTiles));
        }, 120);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tiles, isTransitioning]);

  function updateNewTile(newTiles: Tile[], newTile: Tile) {
    const newTileId = newTile.id;

    const updatedTiles = newTiles.map((tile) => {
      if (tile.id === newTileId) {
        if (tile.x < 0) {
          tile.x = 0;
        } else if (tile.x >= gridSize) {
          tile.x = gridSize - 1;
        } else if (tile.y < 0) {
          tile.y = 0;
        } else if (tile.y >= gridSize) {
          tile.y = gridSize - 1;
        }
      }
      return tile;
    });

    return updatedTiles;
  }

  return { tiles };
}
