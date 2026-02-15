import { BOARD_SIZE } from "@/constants/board";
import type { LadderPosition } from "@/constants/board";

interface LadderConnectionProps {
  ladder: LadderPosition;
}

export const LadderConnection = ({ ladder }: LadderConnectionProps) => {
  const getSquareCenter = (position: number) => {
    const index = position - 1;
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;

    const adjustedCol = row % 2 === 0 ? col : BOARD_SIZE - 1 - col;

    const x = (adjustedCol + 0.5) * (100 / BOARD_SIZE);
    const y = (BOARD_SIZE - 1 - row + 0.5) * (100 / BOARD_SIZE);

    return { x, y };
  };

  const startPos = getSquareCenter(ladder.start);
  const endPos = getSquareCenter(ladder.end);

  // Calculate angle and length for ladder
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const angle = Math.atan2(dy, dx);
  const ladderWidth = 3; // Width of ladder in percentage

  // Calculate side strut positions
  const leftStrut = {
    x1: startPos.x - Math.sin(angle) * ladderWidth,
    y1: startPos.y + Math.cos(angle) * ladderWidth,
    x2: endPos.x - Math.sin(angle) * ladderWidth,
    y2: endPos.y + Math.cos(angle) * ladderWidth,
  };

  const rightStrut = {
    x1: startPos.x + Math.sin(angle) * ladderWidth,
    y1: startPos.y - Math.cos(angle) * ladderWidth,
    x2: endPos.x + Math.sin(angle) * ladderWidth,
    y2: endPos.y - Math.cos(angle) * ladderWidth,
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 20 }}
    >
      {/* Left Strut */}
      <line
        x1={`${leftStrut.x1}%`}
        y1={`${leftStrut.y1}%`}
        x2={`${leftStrut.x2}%`}
        y2={`${leftStrut.y2}%`}
        stroke="#EAB308"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Right Strut */}
      <line
        x1={`${rightStrut.x1}%`}
        y1={`${rightStrut.y1}%`}
        x2={`${rightStrut.x2}%`}
        y2={`${rightStrut.y2}%`}
        stroke="#EAB308"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Ladder Rungs */}
      {[...Array(8)].map((_, i) => {
        const progress = (i + 1) / 9;
        const x1 = leftStrut.x1 + (leftStrut.x2 - leftStrut.x1) * progress;
        const y1 = leftStrut.y1 + (leftStrut.y2 - leftStrut.y1) * progress;
        const x2 = rightStrut.x1 + (rightStrut.x2 - rightStrut.x1) * progress;
        const y2 = rightStrut.y1 + (rightStrut.y2 - rightStrut.y1) * progress;

        return (
          <line
            key={i}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="#EAB308"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
