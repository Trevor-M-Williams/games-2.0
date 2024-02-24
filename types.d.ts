type Score = {
  id: string;
  name: string;
  score: number;
};

type Tile = {
  id: number;
  x: number;
  y: number;
  value: number;
  transition?: "left" | "right" | "up" | "down";
};
