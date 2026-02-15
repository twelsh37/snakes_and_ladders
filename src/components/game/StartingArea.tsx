import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

export const StartingArea = () => {
  const { gameState } = useGame();

  const waitingPlayers = gameState.players.filter(
    (player) => !player.hasStarted
  );

  if (waitingPlayers.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 -top-20 sm:left-auto sm:right-auto sm:-left-44 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto max-w-[200px] mx-auto sm:mx-0 bg-card/95 p-4 rounded-lg shadow-lg border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Waiting to start
      </h3>
      <div className="space-y-2">
        {waitingPlayers.map((player) => (
          <motion.div
            key={player.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border-l-4",
              player.color === "blue" ? "bg-muted border-player-1" : "bg-muted border-player-2"
            )}
          >
            <div
              className={`
                w-8 h-8 rounded-full shadow-lg ring-2 ring-black/20
                flex items-center justify-center text-player-1-foreground font-bold
                ${player.color === "blue" ? "bg-player-1" : "bg-player-2"}
              `}
            >
              {player.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{player.name}</span>
              <span className="text-xs text-muted-foreground">Roll to start</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
