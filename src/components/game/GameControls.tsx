"use client";

import { useEffect, useState } from "react";
import { useGame } from "../../contexts/GameContext";
import { Button } from "../ui/button";
import { RollSixNotification } from "../notifications/RollSixNotification";
import { AnimatePresence } from "framer-motion";

export const GameControls = () => {
  const { gameState, rollDice } = useGame();
  const [showRollSix, setShowRollSix] = useState(false);
  const [rollSixKey, setRollSixKey] = useState(0);

  const lastRoll = gameState.diceHistory[gameState.diceHistory.length - 1];

  // Show notification when a 6 is rolled
  useEffect(() => {
    if (lastRoll?.value === 6 && !gameState.isGameOver) {
      setRollSixKey((prev) => prev + 1);
      setShowRollSix(true);
      const timer = setTimeout(() => {
        setShowRollSix(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastRoll, gameState.isGameOver]);

  const currentPlayer = gameState.players[gameState.currentTurn];

  return (
    <div className="space-y-4">
      <Button
        onClick={rollDice}
        disabled={gameState.isGameOver}
        className="w-full"
      >
        Roll Dice
      </Button>

      <AnimatePresence>
        {showRollSix && currentPlayer && (
          <RollSixNotification
            key={rollSixKey}
            playerName={currentPlayer.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
