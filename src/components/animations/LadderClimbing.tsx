import { motion } from "framer-motion";
import { BOARD_SIZE } from "../../constants/board";

interface LadderClimbingProps {
  playerId: string;
  playerColor: string;
  playerName: string;
  startPosition: number;
  endPosition: number;
  onComplete: () => void;
}

export const LadderClimbing = ({
  playerColor,
  playerName,
  startPosition,
  endPosition,
  onComplete,
}: LadderClimbingProps) => {
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

  // Calculate ladder length and set duration accordingly
  const calculateDuration = () => {
    const distance = Math.abs(endPosition - startPosition);
    // Short ladders (less than 15 squares): 500ms
    // Medium ladders (15-30 squares): 750ms
    // Long ladders (more than 30 squares): 1000ms
    if (distance < 15) return 0.5;
    if (distance < 30) return 0.75;
    return 1;
  };

  return (
    <motion.div
      initial={{ x: `${start.x}%`, y: `${start.y}%` }}
      animate={{ x: `${end.x}%`, y: `${end.y}%` }}
      transition={{
        duration: calculateDuration(),
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
      className="absolute z-50"
    >
      <div
        className={`w-16 h-16 rounded-full shadow-lg ring-2 ring-black/20 flex items-center justify-center text-white font-bold text-2xl
          ${playerColor === "blue" ? "bg-blue-500" : "bg-red-500"}`}
      >
        {playerName.charAt(0)}
      </div>
    </motion.div>
  );
};
