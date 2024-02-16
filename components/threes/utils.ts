function checkMoveIsValid(tile: Tile, adjacentTile: Tile | undefined) {
  if (!adjacentTile) return true;
  if (tile.value + adjacentTile.value === 3) return true;
  if (tile.value === adjacentTile.value) {
    if (tile.value > 2) return true;
  }
  return false;
}

export function initTiles(gridSize: number, tileBag: number[]) {
  let newTiles: Tile[] = [];
  let newTileBag = [...tileBag];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (Math.random() > 0.4) continue;

      const randomIndex = Math.floor(Math.random() * newTileBag.length);
      const randomTile = newTileBag[randomIndex];
      newTileBag.splice(randomIndex, 1);

      const id = Math.floor(Math.random() * 1000000000);

      newTiles.push({
        id,
        x: i,
        y: j,
        value: randomTile,
      });
    }
  }

  return { newTiles, newTileBag };
}

export function mergeTiles(tiles: Tile[]) {
  const newTiles = tiles;

  for (let i = 0; i < newTiles.length; i++) {
    const tile = newTiles[i];
    const matchingTile = newTiles.find(
      (t) => t.x === tile.x && t.y === tile.y && t.id !== tile.id
    );
    if (matchingTile) {
      matchingTile.value += tile.value;
      newTiles.splice(i, 1);
    }
  }

  return newTiles;
}

function spawnTile(
  newTiles: Tile[],
  gridSize: number,
  tileBag: number[],
  direction: string
) {
  const value = 3;
  let col = 0;
  let row = 0;

  switch (direction) {
    case "up":
      col = Math.floor(Math.random() * gridSize);
      row = gridSize + 1;
      break;
    case "down":
      col = Math.floor(Math.random() * gridSize);
      break;
    case "left":
      row = Math.floor(Math.random() * gridSize);
      col = gridSize - 1;
      break;
    case "right":
      row = Math.floor(Math.random() * gridSize);
      break;
    default:
      break;
  }

  const id = Math.floor(Math.random() * 1000000000);

  let newTile = {
    id,
    x: col,
    y: row,
    value,
  };

  return newTile;
}

export function updateSpawnTile(newTiles: Tile[]) {
  return newTiles;
}

export function updateTiles(
  event: KeyboardEvent,
  tiles: Tile[],
  gridSize: number
) {
  let moved = false;
  let newTiles = tiles.map((tile) => ({ ...tile }));

  let dx = 0;
  let dy = 0;
  let xStart = 0;
  let yStart = 0;
  let xIncrement = 1;
  let yIncrement = 1;
  let xBoundary = null;
  let yBoundary = null;
  let direction = "";

  switch (event.key) {
    case "ArrowUp":
    case "w":
      dy = -1;
      yBoundary = 0;
      direction = "up";
      break;
    case "ArrowDown":
    case "s":
      dy = 1;
      yStart = gridSize - 1;
      yIncrement = -1;
      yBoundary = gridSize - 1;
      direction = "down";
      break;
    case "ArrowLeft":
    case "a":
      dx = -1;
      xBoundary = 0;
      direction = "left";
      break;
    case "ArrowRight":
    case "d":
      dx = 1;
      xStart = gridSize - 1;
      xIncrement = -1;
      xBoundary = gridSize - 1;
      direction = "right";
      break;
    case "default":
      break;
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const xIndex = xStart + i * xIncrement;
      const yIndex = yStart + j * yIncrement;

      if (xIndex === xBoundary || yIndex === yBoundary) continue;

      const tile = newTiles.find((t) => t.x === xIndex && t.y === yIndex);
      if (!tile) continue;

      const adjacentTile = newTiles.find(
        (t) => t.x === tile.x + dx && t.y === tile.y + dy
      );

      if (checkMoveIsValid(tile, adjacentTile)) {
        tile.x += dx;
        tile.y += dy;
        moved = true;
      }
    }
  }

  if (!moved) return { moved, newTiles, newTile: null };

  const newTile = spawnTile(newTiles, gridSize, [1, 2, 3], direction);
  newTiles.push(newTile);

  return { moved, newTiles, newTile };
}
