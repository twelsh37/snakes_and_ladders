import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BOARD_SIZE } from "../../constants/board";

interface LadderClimbingProps {
  playerId: string;
  playerColor: "blue" | "red";
  playerName: string;
  startPosition: number;
  endPosition: number;
  onComplete: () => void;
}

export const LadderClimbing = ({
  playerId,
  playerColor,
  playerName,
  startPosition,
  endPosition,
  onComplete,
}: LadderClimbingProps) => {
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Calculate start and end positions
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

    const start = getSquareCenter(startPosition);
    const end = getSquareCenter(endPosition);

    // Create path points along the ladder
    const pathPoints = [];
    const steps = 10; // Number of points along the path
    for (let i = 0; i <= steps; i++) {
      pathPoints.push({
        x: start.x + (end.x - start.x) * (i / steps),
        y: start.y + (end.y - start.y) * (i / steps),
      });
    }
    setPath(pathPoints);
  }, [startPosition, endPosition]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <motion.div
        initial={{ x: `${path[0]?.x}%`, y: `${path[0]?.y}%` }}
        animate={{
          x: path.map((p) => `${p.x}%`),
          y: path.map((p) => `${p.y}%`),
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          times: path.map((_, i) => i / (path.length - 1)),
        }}
        onAnimationComplete={onComplete}
        className={`
          absolute w-8 h-8 rounded-full shadow-lg ring-2 ring-black/20
          flex items-center justify-center text-white font-bold text-lg
          ${playerColor === "blue" ? "bg-blue-500" : "bg-red-500"}
        `}
      >
        {playerName.charAt(0)}
      </motion.div>
    </div>
  );
};
