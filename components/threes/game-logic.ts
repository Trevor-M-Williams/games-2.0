import { useState, useEffect } from "react";
import {
  updateTiles,
  initTiles,
  mergeTiles,
  checkGameOver,
  calculateScore,
  getBonusTile,
} from "./utils";

export function useGameLogic(gridSize: number) {
  const initialTileBag = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [tileBag, setTileBag] = useState<number[]>(initialTileBag);
  const [nextTile, setNextTile] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highTile, setHighTile] = useState(0);

  useEffect(() => {
    const shuffledTileBag = initialTileBag.sort(() => Math.random() - 0.5);
    let { newTiles, newTileBag } = initTiles(gridSize, shuffledTileBag);
    const nextTile = newTileBag[0];
    newTileBag = newTileBag.slice(1);

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

      const { moved, newTiles } = updateTiles(event, tiles, gridSize, nextTile);

      if (moved) {
        const newHighTile = Math.max(...newTiles.map((tile) => tile.value));

        const nextTile = tileBag[0];
        let newTileBag = tileBag.slice(1);

        if (newTileBag.length === 0) {
          newTileBag = [...initialTileBag].sort(() => Math.random() - 0.5);
          if (newHighTile >= 48) {
            const bonusTile = getBonusTile(highTile);
            newTileBag.push(bonusTile);
          }
        }

        setMoveCount(moveCount + 1);
        setIsTransitioning(true);
        setTiles(newTiles);
        setHighTile(newHighTile);

        setNextTile(nextTile);
        setTileBag(newTileBag);

        setTimeout(() => {
          setIsTransitioning(false);
          setTiles(mergeTiles(newTiles));
        }, 120);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    tiles,
    isTransitioning,
    gameOver,
    moveCount,
    gridSize,
    tileBag,
    nextTile,
    highTile,
  ]);

  useEffect(() => {
    // to promote focus
    // if (moveCount > 10) {
    //   setScore(0);
    //   setGameOver(true);
    // }
    if (checkGameOver(tiles, gridSize)) {
      setScore(calculateScore(tiles));
      setGameOver(true);
    }
  }, [tiles]);

  function onRestart() {
    let { newTiles, newTileBag } = initTiles(gridSize, initialTileBag);
    const nextTile = newTileBag[0];
    newTileBag = newTileBag.slice(1);

    setTiles(newTiles);
    setNextTile(nextTile);
    setTileBag(newTileBag);
    setGameOver(false);
    setMoveCount(0);
  }

  return { tiles, nextTile, gameOver, onRestart, score, moveCount };
}
