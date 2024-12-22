import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useGame } from "../../contexts/GameContext";
import { useState, useEffect } from "react";

interface DiceRollProps {
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
}

export const DiceRoll = ({ isRolling, disabled, onRoll }: DiceRollProps) => {
  const { gameState, resetGame } = useGame();
  const lastRoll = gameState.lastRoll;
  const [spinDuration, setSpinDuration] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle roll animation
  const handleRollClick = async () => {
    if (gameState.isGameOver) {
      resetGame();
      return;
    }

    setIsAnimating(true);
    const duration = Math.random() * 500 + 250;
    setSpinDuration(duration);

    // Wait for animation to complete before calling onRoll
    setTimeout(() => {
      setIsAnimating(false);
      onRoll();
    }, duration);
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Roll Dice</CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        <div className="h-32 flex justify-center perspective-500">
          <AnimatePresence mode="wait">
            {isAnimating ? (
              <motion.div
                key="rolling"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 360 * 3 }}
                exit={{ rotateX: 360 * 3 }}
                transition={{
                  duration: spinDuration / 1000,
                  ease: "easeOut",
                }}
                className="w-24 h-24 flex items-center justify-center text-4xl bg-white border-2 border-gray-200 rounded-xl shadow-lg preserve-3d"
              >
                ?
              </motion.div>
            ) : lastRoll !== null ? (
              <motion.div
                key="result"
                initial={{ rotateX: 360 * 3 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.3 }}
                className="w-24 h-24 flex items-center justify-center text-4xl bg-white border-2 border-gray-200 rounded-xl shadow-lg preserve-3d"
              >
                {lastRoll}
              </motion.div>
            ) : (
              <div className="w-24 h-24 flex items-center justify-center text-4xl bg-white border-2 border-gray-300 border-dashed rounded-xl text-gray-400">
                ?
              </div>
            )}
          </AnimatePresence>
        </div>
        <Button
          onClick={handleRollClick}
          disabled={!gameState.isGameOver && (disabled || isAnimating)}
          className="w-full mt-4"
          variant={gameState.isGameOver ? "success" : "outline"}
          size="lg"
        >
          {gameState.isGameOver ? "New Game" : "Roll Dice"}
        </Button>
      </CardContent>
    </Card>
  );
};
