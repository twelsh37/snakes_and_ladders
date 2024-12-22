import { motion } from "framer-motion";
import { useGame } from "../../contexts/GameContext";

export const StartingArea = () => {
  const { gameState } = useGame();

  // Get players who haven't started
  const waitingPlayers = gameState.players.filter(
    (player) => !player.hasStarted
  );

  if (waitingPlayers.length === 0) return null;

  return (
    <div className="absolute -left-40 top-1/2 -translate-y-1/2 bg-white/80 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-600 mb-2">
        Waiting to Start
      </h3>
      <div className="space-y-2">
        {waitingPlayers.map((player) => (
          <motion.div
            key={player.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`
              flex items-center gap-2 p-2 rounded-lg
              ${player.color === "blue" ? "bg-blue-100" : "bg-red-100"}
            `}
          >
            <div
              className={`
                w-8 h-8 rounded-full shadow-lg ring-2 ring-black/20
                flex items-center justify-center text-white font-bold
                ${player.color === "blue" ? "bg-blue-500" : "bg-red-500"}
              `}
            >
              {player.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{player.name}</span>
              <span className="text-xs text-gray-500">Roll to start</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
