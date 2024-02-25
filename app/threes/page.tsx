"use client";
import { useGameLogic } from "@/components/threes/game-logic";
import {
  GridSpace,
  NextTile,
  Tile,
  GameOverModal,
} from "@/components/threes/ui";
import { Switch } from "@/components/ui/switch";

export default function Threes() {
  const gridSize = 3;
  const {
    tiles,
    nextTile,
    gameOver,
    handleRestart,
    handleGameOver,
    score,
    highScores,
    newHighScore,
    mode,
    setMode,
  } = useGameLogic(gridSize);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      {gameOver && (
        <GameOverModal
          score={score}
          highScores={highScores}
          newHighScore={newHighScore}
          handleGameOver={handleGameOver}
          handleRestart={handleRestart}
        />
      )}

      <div className="grid w-80 grid-cols-3 place-items-center ">
        <p className="text-lg font-medium">{mode}</p>
        <NextTile value={nextTile} />
        <Switch
          onCheckedChange={(value) => {
            setMode(() => (value ? "bot" : "player"));
          }}
        />
      </div>

      <div
        className="relative grid gap-4 rounded-lg bg-gray-200 p-4"
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
            transition={tile.transition}
          />
        ))}
      </div>
    </div>
  );
}
