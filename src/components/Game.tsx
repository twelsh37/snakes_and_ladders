"use client";

import { GameBoard } from "./board/GameBoard";
import { GameSidebar } from "./layout/GameSidebar";
import { GameModeSelect } from "./game/GameModeSelect";
import { PauseMenu } from "./game/PauseMenu";
import { RollSixNotification } from "./notifications/RollSixNotification";
import { useGame } from "../contexts/GameContext";
import { AnimatePresence } from "framer-motion";
import { WinnerCelebration } from "./game/WinnerCelebration";
import { ClientOnly } from "./ClientOnly";

export const Game = () => {
  const { gameState, showRollSixNotification } = useGame();
  const currentPlayer = gameState.players[gameState.currentTurn];

  // Show mode selection if no players are set
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
        <div className="flex h-screen bg-gradient-to-br from-purple-100 to-blue-100 relative z-0">
          <GameSidebar />
          <main className="flex-1 overflow-hidden p-8">
            <div className="flex items-center justify-center h-full">
              <GameBoard />
            </div>
          </main>
        </div>

        {/* Middle Layer - Roll Six Notification */}
        <AnimatePresence>
          {showRollSixNotification && currentPlayer && (
            <RollSixNotification playerName={currentPlayer.name} />
          )}
        </AnimatePresence>

        {/* Top Layer - Winner Celebration */}
        <AnimatePresence>
          {gameState.isGameOver && gameState.winner && (
            <WinnerCelebration winnerName={gameState.winner.name} />
          )}
        </AnimatePresence>

        {/* Pause Menu */}
        <PauseMenu />
      </>
    </ClientOnly>
  );
};
