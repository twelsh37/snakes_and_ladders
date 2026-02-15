import { motion } from "framer-motion";
import { getSquareCenter } from "@/constants/board";

interface SnakeSlidingProps {
  playerId: string;
  playerColor: string;
  playerName: string;
  startPosition: number;
  endPosition: number;
  onComplete: () => void;
}

export const SnakeSliding = ({
  playerColor,
  playerName,
  startPosition,
  endPosition,
  onComplete,
}: SnakeSlidingProps) => {
  const start = getSquareCenter(startPosition);
  const end = getSquareCenter(endPosition);

  const duration = (() => {
    const distance = Math.abs(endPosition - startPosition);
    if (distance < 15) return 0.5;
    if (distance < 30) return 0.75;
    return 1;
  })();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    >
      <motion.div
        initial={{
          left: `${start.x}%`,
          top: `${start.y}%`,
        }}
        animate={{
          left: `${end.x}%`,
          top: `${end.y}%`,
        }}
        transition={{
          duration,
          ease: "easeIn",
        }}
        onAnimationComplete={onComplete}
        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <div
          className={`w-8 h-8 rounded-full shadow-lg ring-2 ring-black/20 flex items-center justify-center text-player-1-foreground font-bold text-lg flex-shrink-0
            ${playerColor === "blue" ? "bg-player-1" : "bg-player-2"}`}
        >
          {playerName.charAt(0)}
        </div>
      </motion.div>
    </div>
  );
};
