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

    // For alternating rows, reverse the column number
    const adjustedCol = row % 2 === 0 ? col : BOARD_SIZE - 1 - col;

    // Calculate center coordinates (percentage-based)
    const x = (adjustedCol + 0.5) * (100 / BOARD_SIZE);
    // Invert the Y coordinate since we want 0,0 at the bottom
    const y = (BOARD_SIZE - 1 - row + 0.5) * (100 / BOARD_SIZE);

    return { x, y };
  };

  const startPos = getSquareCenter(snake.start);
  const endPos = getSquareCenter(snake.end);

  // Calculate control points for a more natural curve
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Adjust control points based on distance and direction
  const controlPoint1 = {
    x: startPos.x + dx * 0.25 - dy * 0.2,
    y: startPos.y + dy * 0.25 + dx * 0.2,
  };

  const controlPoint2 = {
    x: endPos.x - dx * 0.25 - dy * 0.2,
    y: endPos.y - dy * 0.25 + dx * 0.2,
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Snake Body */}
      <path
        d={`M ${startPos.x} ${startPos.y} 
            C ${controlPoint1.x} ${controlPoint1.y},
              ${controlPoint2.x} ${controlPoint2.y},
              ${endPos.x} ${endPos.y}`}
        stroke="#FF4444"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Snake Head */}
      <circle
        cx={startPos.x}
        cy={startPos.y}
        r="6"
        fill="#FF0000"
        stroke="#880000"
        strokeWidth="2"
      />

      {/* Snake Tail */}
      <circle
        cx={endPos.x}
        cy={endPos.y}
        r="4"
        fill="#FF6666"
        stroke="#880000"
        strokeWidth="2"
      />
    </svg>
  );
};
