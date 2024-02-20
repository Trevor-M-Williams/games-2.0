"use client";
import {
  GridSpace,
  NextTile,
  Tile,
  GameOverModal,
} from "@/components/threes/ui";
import { useGameLogic } from "@/components/threes/game-logic";

export default function Threes() {
  const gridSize = 3;
  const {
    tiles,
    nextTile,
    gameOver,
    onRestart,
    score,
    highScores,
    newHighScore,
    moveCount,
  } = useGameLogic(gridSize);

  return (
    <div className="h-full w-full flex flex-col gap-6 items-center justify-center">
      {/* <div className="absolute top-0 right-0">{moveCount}</div> */}

      {gameOver && (
        <GameOverModal
          score={score}
          highScores={highScores}
          newHighScore={newHighScore}
          onRestart={onRestart}
        />
      )}

      <NextTile value={nextTile} />

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
