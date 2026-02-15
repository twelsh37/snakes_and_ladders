"use client";

import { useGame } from "@/contexts/GameContext";
import { DiceRoll } from "@/components/game/DiceRoll";
import { DiceHistory } from "@/components/game/DiceHistory";
import { GameStatistics } from "@/components/game/GameStatistics";
import { PlayerTurn } from "@/components/game/PlayerTurn";
import { Button } from "@/components/ui/button";
import { LogViewerModal } from "@/components/game/LogViewerModal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GameSidebar = () => {
  const { gameState, isPaused, rollDice, togglePause, isMoving } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);

  const handleRollClick = async () => {
    setIsRolling(true);
    await rollDice();
    setIsRolling(false);
  };

  const currentPlayer = gameState.players[gameState.currentTurn];

  if (!currentPlayer) return null;

  const sidebarContent = (
    <>
      <PlayerTurn />
      <div className="space-y-4">
        <DiceRoll
          isRolling={isRolling}
          disabled={(isMoving ?? false) || (currentPlayer?.isComputer ?? false)}
          onRoll={handleRollClick}
        />
        <DiceHistory />
      </div>
      <GameStatistics />
      <div className="pt-4 border-t border-border space-y-2">
        <Button variant="secondary" className="w-full" onClick={togglePause}>
          Pause Game
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setIsLogViewerOpen(true);
            setSidebarOpen(false);
          }}
        >
          Game log ({gameState.rollLog?.length ?? 0})
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: floating button to open sidebar */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Open game controls"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile: overlay when sidebar open */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Mobile: slide-in drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="lg:hidden fixed top-0 right-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-xl z-50 p-4 overflow-y-auto"
            aria-label="Game controls"
          >
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} aria-label="Close controls">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="space-y-4">{sidebarContent}</div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop: always-visible sidebar */}
      <aside
        className="hidden lg:block w-80 flex-shrink-0 p-4 bg-card rounded-lg shadow-lg border border-border"
        aria-label="Game controls"
      >
        <div className="space-y-4">{sidebarContent}</div>
      </aside>

      <LogViewerModal
        isOpen={isLogViewerOpen}
        onClose={() => setIsLogViewerOpen(false)}
      />
    </>
  );
};
