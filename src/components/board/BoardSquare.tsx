import { useContext } from "react";
import { useGame } from "../../contexts/GameContext";
import { SNAKES, LADDERS } from "../../constants/board";
import { motion, AnimatePresence } from "framer-motion";

type BoardSquareProps = {
  number: number;
  position: {
    row: number;
    col: number;
  };
};

export const BoardSquare = ({ number, position }: BoardSquareProps) => {
  const { gameState } = useGame();
  const isSnakeHead = number in SNAKES;
  const isSnakeTail = Object.values(SNAKES).includes(number);
  const isLadderBottom = number in LADDERS;
  const isLadderTop = Object.values(LADDERS).includes(number);

  // Find the connected square for snakes and ladders
  const connectedSquare = isSnakeHead
    ? SNAKES[number]
    : isLadderBottom
    ? LADDERS[number]
    : null;

  // Only show players that have started and are on this square
  const playersHere = gameState.players.filter(
    (player) => player.hasStarted && player.position === number
  );

  return (
    <div
      className={`
        relative aspect-square border border-blue-200 rounded-sm p-1
        flex items-center justify-center
        transition-colors duration-200
        ${isSnakeHead ? "bg-red-200" : ""}
        ${isSnakeTail ? "bg-red-100" : ""}
        ${isLadderBottom ? "bg-green-200" : ""}
        ${isLadderTop ? "bg-green-100" : ""}
        hover:bg-blue-50
      `}
    >
      {/* Square number */}
      <span className="absolute bottom-0.5 right-0.5 text-[0.5rem] text-gray-600">
        {number}
      </span>

      {/* Connection indicator */}
      {connectedSquare && (
        <span className="absolute top-0.5 left-0.5 text-[0.5rem] font-bold">
          {isSnakeHead ? "↓" : "↑"} {connectedSquare}
        </span>
      )}

      <AnimatePresence mode="sync">
        {playersHere.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {playersHere.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ scale: 0, y: -50 }}
                animate={{
                  scale: 1,
                  y: 0,
                  x: playersHere.length > 1 ? (index === 0 ? -12 : 12) : 0,
                }}
                exit={{ scale: 0, y: 50 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
                className={`
                  absolute w-12 h-12 rounded-full shadow-lg ring-1 ring-black
                  flex items-center justify-center text-white font-bold text-lg
                  ${player.color === "blue" ? "bg-blue-500" : "bg-red-500"}
                `}
                style={{ zIndex: 10 }}
              >
                {player.name.charAt(0)}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
