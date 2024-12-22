import { BOARD_SIZE } from "../../constants/board";
import type { SnakePosition } from "../../constants/board";

interface SnakeConnectionProps {
  snake: SnakePosition;
}

export const SnakeConnection = ({ snake }: SnakeConnectionProps) => {
  const getSquareCenter = (position: number) => {
    const index = position - 1;
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const adjustedCol = row % 2 === 0 ? col : BOARD_SIZE - 1 - col;

    return {
      x: (adjustedCol + 0.5) * (100 / BOARD_SIZE),
      y: (BOARD_SIZE - 1 - row + 0.5) * (100 / BOARD_SIZE),
    };
  };

  const start = getSquareCenter(snake.start);
  const end = getSquareCenter(snake.end);

  // Calculate midpoints for the S-curve
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Adjust control points for a more pronounced curve
  const controlPoint1 = {
    x: start.x + dx * 0.25,
    y: start.y + dy * 0.1 + 15, // Add offset for curve
  };

  const controlPoint2 = {
    x: end.x - dx * 0.25,
    y: end.y - dy * 0.1 - 15, // Add offset for curve
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Snake Body */}
      <path
        d={`
          M ${start.x} ${start.y}
          C ${controlPoint1.x} ${controlPoint1.y},
            ${controlPoint2.x} ${controlPoint2.y},
            ${end.x} ${end.y}
        `}
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Snake Head */}
      <circle
        cx={start.x}
        cy={start.y}
        r="2"
        fill="#DC2626"
        stroke="#991B1B"
        strokeWidth="0.5"
      />

      {/* Snake Tail */}
      <circle
        cx={end.x}
        cy={end.y}
        r="1.5"
        fill="#FCA5A5"
        stroke="#991B1B"
        strokeWidth="0.5"
      />
    </svg>
  );
};
