import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";

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

  const currentPlayer = gameState.players[gameState.currentTurn];
  const isComputerTurn = currentPlayer?.isComputer ?? false;
  const isDisabled = !gameState.isGameOver && (disabled || isAnimating);

  const handleRollClick = async () => {
    if (gameState.isGameOver) {
      resetGame();
      return;
    }

    setIsAnimating(true);
    const duration = Math.random() * 500 + 250;
    setSpinDuration(duration);

    setTimeout(() => {
      setIsAnimating(false);
      onRoll();
    }, duration);
  };

  const buttonLabel = gameState.isGameOver
    ? "New Game"
    : isComputerTurn
    ? "Computer's turn…"
    : "Roll Dice";

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle>Dice</CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        <div
          className="h-32 flex flex-col items-center justify-center gap-2 perspective-500"
          aria-live="polite"
          aria-label={lastRoll !== null ? `Last roll: ${lastRoll}` : "No roll yet"}
        >
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
                className="w-24 h-24 flex items-center justify-center text-4xl bg-card border-2 border-border rounded-xl shadow-lg preserve-3d"
              >
                ?
              </motion.div>
            ) : lastRoll !== null ? (
              <motion.div
                key="result"
                initial={{ rotateX: 360 * 3 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.3 }}
                className="w-24 h-24 flex items-center justify-center text-4xl bg-card border-2 border-border rounded-xl shadow-lg preserve-3d font-semibold"
              >
                {lastRoll}
              </motion.div>
            ) : (
              <div className="w-24 h-24 flex items-center justify-center text-4xl bg-muted border-2 border-dashed border-border rounded-xl text-muted-foreground">
                ?
              </div>
            )}
          </AnimatePresence>
          {isComputerTurn && isDisabled && !gameState.isGameOver && (
            <p className="text-sm text-muted-foreground">Computer's turn…</p>
          )}
        </div>
        <Button
          onClick={handleRollClick}
          disabled={isDisabled}
          className="w-full mt-4"
          variant={gameState.isGameOver ? "success" : "primary"}
          aria-label={gameState.isGameOver ? "Start a new game" : "Roll the dice"}
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
};
