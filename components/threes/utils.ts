const scoreMap = {
  1: 0,
  2: 0,
  3: 1,
  6: 2,
  12: 3,
  24: 4,
  48: 5,
  96: 6,
  192: 7,
  384: 8,
  768: 9,
  1536: 10,
  3072: 11,
  6144: 12,
};

export function calculateScore(tiles: Tile[]) {
  let score = 0;
  for (let i = 0; i < tiles.length; i++) {
    const exponent = scoreMap[tiles[i].value as keyof typeof scoreMap];
    score += 3 ** exponent;
  }

  return score;
}

export function checkGameOver(tiles: Tile[], gridSize: number) {
  // logTiles(tiles, gridSize);

  if (tiles.length < gridSize ** 2) return false;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const tile = tiles.find((t) => t.x === i && t.y === j);
      if (!tile) return false;

      const adjacentTile1 = tiles.find((t) => t.x === i + 1 && t.y === j);
      const adjacentTile2 = tiles.find((t) => t.x === i && t.y === j + 1);

      if (adjacentTile1) {
        if (checkMoveIsValid(tile, adjacentTile1)) {
          return false;
        }
      }

      if (adjacentTile2) {
        if (checkMoveIsValid(tile, adjacentTile2)) {
          return false;
        }
      }
    }
  }

  return true;
}

function checkMoveIsValid(tile: Tile, adjacentTile: Tile | undefined) {
  if (!adjacentTile) return true;
  if (tile.value + adjacentTile.value === 3) return true;
  if (tile.value === adjacentTile.value) {
    if (tile.value > 2) return true;
  }
  return false;
}

export function getBonusTile(highTile: number) {
  const exponent = scoreMap[highTile as keyof typeof scoreMap];
  const bonusExponentMin = 2;
  const bonusExponentMax = exponent - 3;
  const randomExponent =
    bonusExponentMin +
    Math.floor(Math.random() * (bonusExponentMax - bonusExponentMin));
  const bonusTile = 3 * 2 ** randomExponent;

  return bonusTile;
}

export function initTiles(gridSize: number, tileBag: number[]) {
  let newTiles: Tile[] = [];

  const numTiles = Math.floor((gridSize ** 2 * 9) / 16);

  for (let i = 0; i < numTiles; i++) {
    const nextTile = tileBag[i];

    while (true) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      const tile = newTiles.find((t) => t.x === x && t.y === y);
      if (!tile) {
        newTiles.push({ id: i, x, y, value: nextTile });
        break;
      }
    }
  }

  const newTileBag = tileBag.slice(numTiles);
  return { newTiles, newTileBag };
}

export function mergeTiles(tiles: Tile[]) {
  const newTiles = tiles;

  for (let i = 0; i < newTiles.length; i++) {
    const tile = newTiles[i];
    const matchingTile = newTiles.find(
      (t) => t.x === tile.x && t.y === tile.y && t.id !== tile.id,
    );
    if (matchingTile) {
      if (
        (tile.value === 1 && matchingTile.value === 2) ||
        (tile.value === 2 && matchingTile.value === 1) ||
        (tile.value === matchingTile.value && tile.value > 2)
      ) {
        matchingTile.value += tile.value;
        newTiles.splice(i, 1);
      }
    }
  }

  return newTiles;
}

function spawnTile(
  newTiles: Tile[],
  gridSize: number,
  nextTile: number,
  direction: "up" | "down" | "left" | "right",
) {
  let position = getTilePosition(direction, gridSize, newTiles);

  const id = Math.floor(Math.random() * 1000000000);
  let newTile = {
    id,
    x: position.col,
    y: position.row,
    value: nextTile,
    transition: direction,
  };

  return newTile;

  function getTilePosition(
    direction: string,
    gridSize: number,
    newTiles: Tile[],
  ) {
    let col = 0;
    let row = 0;
    let found = false;

    while (!found) {
      col = Math.floor(Math.random() * gridSize);
      row = Math.floor(Math.random() * gridSize);
      switch (direction) {
        case "up":
          found = !newTiles.find((t) => t.x === col && t.y === gridSize - 1);
          row = gridSize - 1;
          break;
        case "down":
          found = !newTiles.find((t) => t.x === col && t.y === 0);
          row = 0;
          break;
        case "left":
          found = !newTiles.find((t) => t.x === gridSize - 1 && t.y === row);
          col = gridSize - 1;
          break;
        case "right":
          found = !newTiles.find((t) => t.x === 0 && t.y === row);
          col = 0;
          break;
      }
    }

    return { col, row };
  }
}

export function updateNewTile(tiles: Tile[], newTile: Tile, gridSize: number) {
  const newTiles = [...tiles];
  const tile = newTiles.find((t) => t.x === newTile.x && t.y === newTile.y);

  if (!tile) return newTiles;

  if (tile.x > gridSize) tile.x = gridSize - 1;
  else if (tile.x < 0) tile.x = 0;
  else if (tile.y > gridSize) tile.y = gridSize - 1;
  else if (tile.y < 0) tile.y = 0;

  return newTiles;
}

export function updateTiles(
  key: string,
  tiles: Tile[],
  gridSize: number,
  nextTile: number,
) {
  let moved = false;
  let newTiles = tiles.map((t) => {
    const { transition, ...tile } = t;
    return tile;
  });

  let dx = 0;
  let dy = 0;
  let xStart = 0;
  let yStart = 0;
  let xIncrement = 1;
  let yIncrement = 1;
  let xBoundary = null;
  let yBoundary = null;
  let direction: "up" | "down" | "left" | "right" | null = null;

  switch (key) {
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
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const xIndex = xStart + i * xIncrement;
      const yIndex = yStart + j * yIncrement;

      if (xIndex === xBoundary || yIndex === yBoundary) continue;

      const tile = newTiles.find((t) => t.x === xIndex && t.y === yIndex);
      if (!tile) continue;

      const adjacentTile = newTiles.find(
        (t) => t.x === tile.x + dx && t.y === tile.y + dy,
      );

      if (checkMoveIsValid(tile, adjacentTile)) {
        tile.x += dx;
        tile.y += dy;
        moved = true;
      }
    }
  }

  if (!moved || !direction) return { moved, newTiles, newTile: null };

  const newTile = spawnTile(newTiles, gridSize, nextTile, direction);
  newTiles.push(newTile);

  return { moved, newTiles, newTile };
}

// --------- Utility Functions --------- //

function logTiles(tiles: Tile[], gridSize: number) {
  const grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => "."),
  );

  tiles.forEach((tile) => {
    if (tile.x >= 0 && tile.x < gridSize && tile.y >= 0 && tile.y < gridSize) {
      grid[tile.y][tile.x] = tile.value.toString();
    }
  });

  console.log("Board:");
  grid.forEach((row) => console.log(row.join(" ")));
}
