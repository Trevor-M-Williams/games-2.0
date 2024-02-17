import { useState, useEffect } from "react";
import { updateTiles, initTiles, mergeTiles, checkGameOver } from "./utils";

export function useGameLogic(gridSize: number) {
  const initialTileBag = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 6];

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [tileBag, setTileBag] = useState<number[]>(initialTileBag);
  const [nextTile, setNextTile] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [moveNumber, setMoveNumber] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let { newTiles, newTileBag } = initTiles(gridSize, tileBag);
    const nextTile = newTileBag[Math.floor(Math.random() * newTileBag.length)];
    newTileBag = newTileBag.filter((tile) => tile !== nextTile);

    setTiles(newTiles);
    setNextTile(nextTile);
    setTileBag(newTileBag);
  }, [gridSize]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (gameOver) return;
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

      const { moved, newTiles, newTile } = updateTiles(
        event,
        tiles,
        gridSize,
        nextTile
      );

      if (moved) {
        setMoveNumber(moveNumber + 1);
        setIsTransitioning(true);
        setTiles(newTiles);

        const nextTile = tileBag[Math.floor(Math.random() * tileBag.length)];
        let newTileBag = tileBag.filter((tile) => tile !== nextTile);

        if (newTileBag.length === 0) {
          newTileBag = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 6];
        }

        setNextTile(nextTile);
        setTileBag(newTileBag);

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
  }, [tiles]);

  useEffect(() => {
    if (moveNumber > 10 || checkGameOver(tiles, gridSize)) {
      setGameOver(true);
    }
  }, [tiles]);

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

  function onRestart() {
    let { newTiles, newTileBag } = initTiles(gridSize, initialTileBag);
    const nextTile = newTileBag[Math.floor(Math.random() * newTileBag.length)];
    newTileBag = newTileBag.filter((tile) => tile !== nextTile);

    setTiles(newTiles);
    setNextTile(nextTile);
    setTileBag(newTileBag);
    setGameOver(false);
    setMoveNumber(0);
  }

  return { tiles, nextTile, gameOver, onRestart };
}
