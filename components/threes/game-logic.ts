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
  const [tileBag, setTileBag] = useState(initialTileBag);
  const [nextTile, setNextTile] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highTile, setHighTile] = useState(0);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [newHighScore, setNewHighScore] = useState("");
  const [mode, setMode] = useState("player");

  useEffect(() => {
    restartGame();
    fetchScores();
    // setMode("bot");
  }, [gridSize]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || isTransitioning || mode !== "player") return;
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
      processMove(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    tiles,
    isTransitioning,
    gameOver,
    moveCount,
    gridSize,
    tileBag,
    nextTile,
    highTile,
    mode,
  ]);

  useEffect(() => {
    if (mode !== "bot" || gameOver) return;
    const interval = setInterval(simulateBotMove, 500);
    return () => clearInterval(interval);
  }, [
    mode,
    gameOver,
    tiles,
    isTransitioning,
    moveCount,
    gridSize,
    tileBag,
    nextTile,
    highTile,
  ]);

  async function fetchScores() {
    const response = await fetch("/api/threes");
    if (response.ok) {
      const fetchedScores = await response.json();
      setHighScores(fetchedScores);
    }
  }

  function processMove(key: string) {
    setTiles((currentTiles) => {
      const { moved, newTiles, newTile } = updateTiles(
        key,
        currentTiles,
        gridSize,
        nextTile
      );

      if (moved && newTile) {
        updateAfterMove(newTiles, newTile);
        return newTiles;
      }

      return currentTiles;
    });
  }

  function restartGame() {
    const { newTiles, newTileBag } = initTiles(
      gridSize,
      [...initialTileBag].sort(() => Math.random() - 0.5)
    );
    setTiles(newTiles);
    setTileBag(newTileBag.slice(1)); // Remove the first tile which is set as nextTile
    setNextTile(newTileBag[0]);
    setGameOver(false);
    setMoveCount(0);
    setScore(0);
    setHighTile(0);
    setNewHighScore("");
  }

  function updateAfterMove(newTiles: Tile[], newTile: Tile) {
    const newHighTile = Math.max(
      ...newTiles.map((tile) => tile.value),
      highTile
    );

    setMoveCount((prevCount) => prevCount + 1);
    setIsTransitioning(true);

    let updatedTileBag = [...tileBag];
    if (updatedTileBag.length === 0) {
      updatedTileBag = [...initialTileBag].sort(() => Math.random() - 0.5);
      if (newHighTile >= 48) {
        const bonusTile = getBonusTile(newHighTile);
        updatedTileBag.push(bonusTile);
      }
    }

    const nextTile = updatedTileBag.shift();
    if (!nextTile) return;
    setTileBag(updatedTileBag);
    setNextTile(nextTile);
    setHighTile(newHighTile);

    setTimeout(() => {
      setIsTransitioning(false);

      setTiles((currentTiles) => {
        const mergedTiles = mergeTiles(currentTiles);
        const isGameOver = checkGameOver(mergedTiles, gridSize);
        if (isGameOver) {
          finalizeGame(mergedTiles);
        }
        console.log(nextTile, updatedTileBag);
        return mergedTiles;
      });
    }, 100);
  }

  function simulateBotMove() {
    const allowedMoves = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const randomMove =
      allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
    processMove(randomMove);
  }

  function finalizeGame(finalTiles: Tile[]) {
    const finalScore = calculateScore(finalTiles);
    setScore(finalScore);
    setGameOver(true);
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

    // const data = await res.json();

    const timestamp = Date.now().toString();
    const data = { id: timestamp, name, score };

    if (
      highScores.length < 10 ||
      data.score > highScores[highScores.length - 1].score
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
    handleRestart: restartGame,
    handleGameOver,
  };
}
