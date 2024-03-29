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
  const [tileBag, setTileBag] = useState(initialTileBag);
  const [nextTile, setNextTile] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highTile, setHighTile] = useState(0);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [newHighScore, setNewHighScore] = useState("");
  const [mode, setMode] = useState("player");

  useEffect(() => {
    handleRestart();
    fetchScores();
  }, [gridSize]);

  useEffect(() => {
    if (gameOver || isTransitioning) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) processMove("ArrowLeft");
        else processMove("ArrowRight");
      } else {
        if (diffY > 0) processMove("ArrowUp");
        else processMove("ArrowDown");
      }
    };

    if (mode === "player") {
      const handleKeyDown = (event: KeyboardEvent) => {
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
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    } else if (mode === "bot") {
      const interval = setInterval(simulateBotMove, 100);
      return () => clearInterval(interval);
    } else {
      console.error("Invalid mode");
    }
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
    processMove,
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
        nextTile,
      );

      if (moved && newTile) {
        updateAfterMove(newTiles, newTile);
        return newTiles;
      }

      return currentTiles;
    });
  }

  function handleRestart() {
    const { newTiles, newTileBag } = initTiles(
      gridSize,
      [...initialTileBag].sort(() => Math.random() - 0.5),
    );
    setTiles(newTiles);
    setTileBag(newTileBag.slice(1));
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
      highTile,
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

    const data = await res.json();

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
    handleRestart,
    handleGameOver,
    mode,
    setMode,
  };
}
