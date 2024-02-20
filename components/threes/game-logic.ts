import { useState, useEffect } from "react";
import {
  updateTiles,
  initTiles,
  mergeTiles,
  checkGameOver,
  calculateScore,
  getBonusTile,
  updateNewTile,
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
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [newHighScore, setNewHighScore] = useState("");

  useEffect(() => {
    const shuffledTileBag = initialTileBag.sort(() => Math.random() - 0.5);
    let { newTiles, newTileBag } = initTiles(gridSize, shuffledTileBag);
    const nextTile = newTileBag[0];
    newTileBag = newTileBag.slice(1);

    setTiles(newTiles);
    setNextTile(nextTile);
    setTileBag(newTileBag);

    async function fetchScores() {
      const res = await fetch("/api/threes");
      if (res.ok) {
        let scores = await res.json();
        scores = scores
          .sort((a: Score, b: Score) => b.score - a.score)
          .slice(0, 10);
        setHighScores(scores);
      }
    }

    fetchScores();
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

      if (moved && newTile) {
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
          setTiles(updateNewTile(newTiles, newTile, gridSize));
        }, 10);

        setTimeout(async () => {
          const mergedTiles = mergeTiles(newTiles);
          setTiles(mergedTiles);
          setIsTransitioning(false);

          if (checkGameOver(mergedTiles, gridSize)) {
            const score = calculateScore(mergedTiles);
            setScore(score);
            setGameOver(true);
          }
        }, 100);
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

  function handleRestart() {
    let { newTiles, newTileBag } = initTiles(gridSize, initialTileBag);
    const nextTile = newTileBag[0];
    newTileBag = newTileBag.slice(1);

    setTiles(newTiles);
    setNextTile(nextTile);
    setTileBag(newTileBag);
    setGameOver(false);
    setMoveCount(0);
    setScore(0);
    setHighTile(0);
    setNewHighScore("");
  }

  async function handleGameOver(name: string) {
    const res = await fetch("/api/threes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    });

    if (!res.ok) {
      console.error("Failed to save score");
    }

    const data = await res.json();

    if (
      data.score > highScores[highScores.length - 1].score ||
      highScores.length < 10
    ) {
      const newHighScores = [...highScores, data]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setHighScores(newHighScores);
      setNewHighScore(data.id);
    }
  }

  return {
    tiles,
    nextTile,
    gameOver,
    score,
    highScores,
    newHighScore,
    moveCount,
    handleRestart,
    handleGameOver,
  };
}
