"use client";

import { GameBoard } from "@/components/board/GameBoard";
import { GameSidebar } from "@/components/layout/GameSidebar";
import { GameModeSelect } from "@/components/game/GameModeSelect";
import { PauseMenu } from "@/components/game/PauseMenu";
import { RollSixNotification } from "@/components/notifications/RollSixNotification";
import { useGame } from "@/contexts/GameContext";
import { AnimatePresence } from "framer-motion";
import { WinnerCelebration } from "@/components/game/WinnerCelebration";
import { ClientOnly } from "@/components/ClientOnly";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { useMemo } from "react";

export const Game = () => {
  const { gameState, showRollSixNotification } = useGame();
  const currentPlayer = gameState.players[gameState.currentTurn];

  const liveMessage = useMemo(() => {
    if (gameState.players.length === 0) return "";
    if (gameState.isGameOver && gameState.winner) {
      return `${gameState.winner.name} wins! Congratulations!`;
    }
    const cp = gameState.players[gameState.currentTurn];
    if (!cp) return "";
    if (cp.isComputer) return "Computer's turn.";
    return `${cp.name}, your turn. Roll the dice.`;
  }, [gameState.players, gameState.currentTurn, gameState.isGameOver, gameState.winner]);

  if (gameState.players.length === 0) {
    return (
      <ClientOnly>
        <GameModeSelect />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <>
        <LiveRegion message={liveMessage} />
        <div
          className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 relative z-0"
          role="application"
          aria-label="Snakes and Ladders game"
        >
          <GameSidebar />
          <main
            className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 min-h-0"
            aria-label="Game board area"
          >
            <div className="flex items-center justify-center h-full min-h-[280px]">
              <GameBoard />
            </div>
          </main>
        </div>

        <AnimatePresence>
          {showRollSixNotification && currentPlayer && (
            <RollSixNotification playerName={currentPlayer.name} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameState.isGameOver && gameState.winner && (
            <WinnerCelebration winnerName={gameState.winner.name} />
          )}
        </AnimatePresence>

        <PauseMenu />
      </>
    </ClientOnly>
  );
};
