export const BOARD_SIZE = 9;
export const ROWS = 9;
export const TOTAL_SQUARES = 81;

/** Board position (1–81) to percentage (0–100) for token placement. Matches board layout. */
export function getSquareCenter(position: number): { x: number; y: number } {
  const index = position - 1;
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const adjustedCol = row % 2 === 0 ? col : BOARD_SIZE - 1 - col;
  return {
    x: (adjustedCol + 0.5) * (100 / BOARD_SIZE),
    y: (BOARD_SIZE - 1 - row + 0.5) * (100 / BOARD_SIZE),
  };
}

export const SNAKES: Record<number, number> = {
  78: 59,
  75: 70,
  55: 38,
  50: 44,
  35: 16,
  13: 8,
};

export const LADDERS: Record<number, number> = {
  1: 22,
  6: 15,
  11: 27,
  19: 52,
  31: 52,
  46: 63,
  57: 73,
  67: 80,
};

export const LADDER_POSITIONS = [
  { start: 1, end: 22 },
  { start: 6, end: 15 },
  { start: 11, end: 27 },
  { start: 19, end: 52 },
  { start: 31, end: 52 },
  { start: 46, end: 63 },
  { start: 57, end: 73 },
  { start: 67, end: 80 },
] as const;

export const SNAKE_POSITIONS = [
  { start: 78, end: 59 },
  { start: 75, end: 70 },
  { start: 55, end: 38 },
  { start: 50, end: 44 },
  { start: 35, end: 16 },
  { start: 13, end: 8 },
] as const;

export type LadderPosition = (typeof LADDER_POSITIONS)[number];
export type SnakePosition = (typeof SNAKE_POSITIONS)[number];
