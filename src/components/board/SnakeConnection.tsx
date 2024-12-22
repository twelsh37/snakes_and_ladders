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

    const x = (adjustedCol + 0.5) * (100 / BOARD_SIZE);
    const y = (BOARD_SIZE - 1 - row + 0.5) * (100 / BOARD_SIZE);

    return { x, y };
  };

  const startPos = getSquareCenter(snake.start);
  const endPos = getSquareCenter(snake.end);

  // Calculate midpoints for the S-curve
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;

  // Adjust control points for a more pronounced curve
  const controlPoint1 = {
    x: startPos.x + dx * 0.25,
    y: startPos.y + dy * 0.1 + 15, // Add offset for curve
  };

  const controlPoint2 = {
    x: endPos.x - dx * 0.25,
    y: endPos.y - dy * 0.1 - 15, // Add offset for curve
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
          M ${startPos.x} ${startPos.y}
          C ${controlPoint1.x} ${controlPoint1.y},
            ${controlPoint2.x} ${controlPoint2.y},
            ${endPos.x} ${endPos.y}
        `}
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Snake Head */}
      <circle
        cx={startPos.x}
        cy={startPos.y}
        r="2"
        fill="#DC2626"
        stroke="#991B1B"
        strokeWidth="0.5"
      />

      {/* Snake Tail */}
      <circle
        cx={endPos.x}
        cy={endPos.y}
        r="1.5"
        fill="#FCA5A5"
        stroke="#991B1B"
        strokeWidth="0.5"
      />

      {/* Debug points */}
      <circle
        cx={controlPoint1.x}
        cy={controlPoint1.y}
        r="0.5"
        fill="blue"
        opacity="0.5"
      />
      <circle
        cx={controlPoint2.x}
        cy={controlPoint2.y}
        r="0.5"
        fill="blue"
        opacity="0.5"
      />
    </svg>
  );
};
