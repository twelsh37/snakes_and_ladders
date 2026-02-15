"use client";

import { useGame } from "@/contexts/GameContext";
import { getSquareCenter } from "@/constants/board";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Renders all player tokens in a single top layer so they are never obscured
 * by snakes, ladders, or grid. Uses the same coordinates as the board.
 */
export function TokenOverlay() {
  const { gameState, movementState } = useGame();

  const slidingOrClimbingPlayerId =
    movementState?.isClimbingLadder || movementState?.isSlidingSnake
      ? movementState.playerId
      : null;

  const playersToShow = gameState.players.filter(
    (p) =>
      p.hasStarted &&
      p.id !== slidingOrClimbingPlayerId
  );

  const byPosition = new Map<number, typeof gameState.players>();
  for (const p of playersToShow) {
    const list = byPosition.get(p.position) ?? [];
    list.push(p);
    byPosition.set(p.position, list);
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
      aria-hidden
    >
      {Array.from(byPosition.entries()).map(([position, players]) => {
        const { x, y } = getSquareCenter(position);
        return (
          <div
            key={position}
            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ scale: 0, y: -50 }}
                animate={{
                  scale: 1,
                  y: 0,
                  x: players.length > 1 ? (index === 0 ? -12 : 12) : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
                className={cn(
                  "absolute w-8 h-8 rounded-full shadow-lg ring-2 ring-black/20",
                  "flex items-center justify-center text-player-1-foreground font-bold text-lg",
                  player.color === "blue" ? "bg-player-1" : "bg-player-2"
                )}
              >
                {player.name.charAt(0)}
              </motion.div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
